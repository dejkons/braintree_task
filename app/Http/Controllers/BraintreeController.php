<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

/**
 * Braintree service controller
 * Idea is to hold set of functions capable to work with Braintree services
 */
class BraintreeController extends Controller
{
    /**
     * Core method in order to obtain gateway based on credentials
     */
    public function getGateway(Request $request): \Braintree\Gateway
    {
        return new \Braintree\Gateway([
            'environment' => env('BRAINTREE_ENVIRONMENT'),
            'merchantId' => env("BRAINTREE_MERCHANT_ID"),
            'publicKey' => env("BRAINTREE_PUBLIC_KEY"),
            'privateKey' => env("BRAINTREE_PRIVATE_KEY")
        ]);
    }

    /**
     * Get client token, central piece to call other stuff
     */
    public function getClientToken(Request $request): string
    {
        return BraintreeController::getGateway($request)->clientToken()->generate();
    }

    /**
     * Get predefined subscription plans (defined in Braintree)
     */
    public function getPlans(Request $request): Response
    {
        return Inertia::render('Dashboard', [
            'plans' => BraintreeController::getGateway($request)->plan()->all(),
            'isSubscribed' => BraintreeController::isCustomerSubscribed($request)
        ]);
    }


    /**
     * Get plan details based on plan ID
     */
    public function getPlanDetails(Request $request, $planId):Response | null
    {
        try {
            return Inertia::render('Profile/Edit', [
                'selectedPlan' => BraintreeController::getGateway($request)->plan()->find($planId),
                'isSubscribed' => BraintreeController::isCustomerSubscribed($request)
            ]);
        } catch (Throwable $e) {
            report($e);
            return null;
        }
    }

    /**
     * Add customer to Braintree vault
     */
    public function addCustomer(Request $request, $nonceFromTheClient) {
        return BraintreeController::getGateway($request)->customer()->create([
            'firstName' => BraintreeController::split_name($request->user()->name)[0],
            'lastName' => BraintreeController::split_name($request->user()->name)[1],
            'id' => BraintreeController::constructCustomerId($request),
            'paymentMethodNonce' => $nonceFromTheClient
        ]);
    }

    /**
     * Simple check is customer anywhere subscribed?
     */
    public function isCustomerSubscribed(Request $request) {
        $currentCustomer = BraintreeController::getCustomerFromVault($request);
        if ($currentCustomer) {
            // customer is in the vault, check is subscribed
            $cards = $currentCustomer->creditCards;
            if (sizeof($cards) > 0) {
                foreach ($cards as $card) {
                    if (sizeof($card->subscriptions) > 0) {
                        foreach ($card->subscriptions as $subscription) {
                            if ($subscription->status == "Active") {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    /**
     * Simple cancel of any active subscription
     */
    public function cancelActiveSubscription(Request $request) {
        $currentCustomer = BraintreeController::getCustomerFromVault($request);
        if ($currentCustomer) {
            // customer is in the vault, check is subscribed
            $cards = $currentCustomer->creditCards;
            if (sizeof($cards) > 0) {
                foreach ($cards as $card) {
                    if (sizeof($card->subscriptions) > 0) {
                        foreach ($card->subscriptions as $subscription) {
                            if ($subscription->status == "Active") {
                                BraintreeController::getGateway($request)->subscription()->cancel($subscription->id);
                                return true;
                            }
                        }
                    }
                }
                return true;
            }
        }
        return false;
    }

    /**
     * Method which constructs customer ID
     */
    private function constructCustomerId(Request $request) {
        return $request->user()->id."_".str_replace(' ', '', strtolower($request->user()->name));
    }

    /**
     * Return customer from Braintree vault
     */
    public function getCustomerFromVault(Request $request): bool|\Braintree\Customer
    {
        try {
            return BraintreeController::getGateway($request)->customer()->find(BraintreeController::constructCustomerId($request));
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * At the moment just placeholder for more complex method, for now proxy for calling subscription
     */
    public function makeTransaction(Request $request, $nonceFromTheClient, $selectedPlan) {
        return BraintreeController::makeSubscription($request, $nonceFromTheClient, $selectedPlan);
    }

    /**
     * Method for calling subscription based on selected plan
     */
    public function makeSubscription(Request $request, $nonceFromTheClient, $selectedPlan) {

        //return BraintreeController::addCustomer($request, $nonceFromTheClient);
        $currentCustomer = BraintreeController::getCustomerFromVault($request);
        if (!$currentCustomer) {
            // customer is not registered in vault at all, register customer
            BraintreeController::addCustomer($request, $nonceFromTheClient);
            // customer is in the vault, check is subscribed
            $currentCustomer = BraintreeController::getCustomerFromVault($request);
        }

        // if not subscribed, subscribe it
        $cards = $currentCustomer->creditCards;
        $paymentToken = "";

        if (sizeof($cards) > 0) {
            $paymentToken = $cards[0]->token;
        }

        BraintreeController::getGateway($request)->subscription()->create([
            'paymentMethodToken' => $paymentToken,
            'planId' => $selectedPlan
        ]);

        return "Successful subscription";

    }

    /**
     * Helper method to handle split of [name lastname] => [name][lastname]
     */
    private function split_name($name) {
        $name = trim($name);
        $last_name = (strpos($name, ' ') === false) ? '' : preg_replace('#.*\s([\w-]*)$#', '$1', $name);
        $first_name = trim( preg_replace('#'.preg_quote($last_name,'#').'#', '', $name ) );
        return array($first_name, $last_name);
    }

}

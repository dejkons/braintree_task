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

}

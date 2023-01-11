import PrimaryButton from '@/Components/PrimaryButton';
import BraintreeDropIn from "@/Components/BraintreeDropIn";
import {useState} from "react";

export default function UpdateSubscriptionForm({ className, selectedPlan, clientToken, isSubscribed }) {

    const [showBraintreeDropIn, setShowBraintreeDropIn] = useState(true);

    const methodCompleted = () => {
        setShowBraintreeDropIn(false);
    };

    const cancelSubscription = () => {
        axios.get(route('subscription.cancel')).then(() => {
            window.location.replace("/profile");
        });
    };

    let res = "";

    if (!isSubscribed) {
        res = <div>
            <div className="subscriptionSelection bg-slate-100 mt-5 mb-5 p-10">
                <p>Subscription title: {selectedPlan.name}</p>
                <p>Subscription amount: {selectedPlan.price} {selectedPlan.currencyIsoCode}</p>
            </div>
            <BraintreeDropIn show={showBraintreeDropIn}
                             onPaymentCompleted={methodCompleted}
                             selectedPlan={selectedPlan}
                             clientToken={clientToken}
            />
        </div>;
    } else {
        res = <div><PrimaryButton className={"mt-5"} onClick={cancelSubscription} type={"submit"} >Cancel Subscription</PrimaryButton></div>
    }

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Subscription</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Manage your subscription.
                    {clientToken}
                </p>
            </header>
            {res}
        </section>
    );
}

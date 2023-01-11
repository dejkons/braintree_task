import React, {useEffect, useState} from 'react'
import dropin from "braintree-web-drop-in"
import PrimaryButton from "@/Components/PrimaryButton";
import {Inertia} from "@inertiajs/inertia";

export default function BraintreeDropIn(props) {
    const {show, onPaymentCompleted, selectedPlan} = props;

    const [braintreeInstance, setBraintreeInstance] = useState(undefined);
    const [authToken, setAuthToken] = useState(undefined);

    useEffect(() => {
        async function fetchToken() {
            const res = await axios.get(route('profile.token'));
            setAuthToken(res.data);
        }
        fetchToken();
    }, []);

    useEffect( () => {
        if (show) {
            const initializeBraintree = () => dropin.create({
                authorization: authToken,
                container: '#braintree-drop-in-div',
                paypal: {
                    flow: 'checkout',
                    amount: selectedPlan.amount,
                    currency: selectedPlan.currencyIsoCode
                }
            }, function (error, instance) {
                if (error)
                    console.error(error)
                else
                    setBraintreeInstance(instance);
            });

            if (braintreeInstance) {
                braintreeInstance
                    .teardown()
                    .then(() => {
                        initializeBraintree();
                    });
            } else {
                initializeBraintree();
            }
        }
    }, [show, authToken])

    return (
        <div
            style={{display: `${show ? "block" : "none"}`}}
        >
            <div
                id={"braintree-drop-in-div"}
            />

            <PrimaryButton
                className={"braintreePayButton"}
                type="primary"
                disabled={!braintreeInstance}
                onClick={() => {
                    if (braintreeInstance) {
                        braintreeInstance.requestPaymentMethod(
                            (error, payload) => {
                                if (error) {
                                    console.error(error);
                                } else {
                                    const paymentMethodNonce = payload.nonce;
                                    console.log("payment method nonce", payload.nonce);
                                    Inertia.visit(route('payment.transaction', [paymentMethodNonce, selectedPlan]), {
                                        method: 'get',
                                        preserveScroll: true,
                                        onSuccess: () => {
                                            console.log('Transaction successful');
                                        },
                                        onError: (er) => {
                                            console.log('Transaction failed');
                                        }
                                    });

                                    onPaymentCompleted();
                                }
                            });
                    }
                }}
            >
                {
                    "Pay"
                }
            </PrimaryButton>
        </div>
    )
}

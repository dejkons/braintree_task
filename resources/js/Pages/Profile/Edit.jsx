import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import {Head, usePage} from '@inertiajs/inertia-react';
import UpdateSubscriptionForm from "@/Pages/Profile/Partials/UpdateSubscriptionForm";

export default function Edit({ auth, mustVerifyEmail, status, selectedPlan, clientToken, isSubscribed }) {

    if (!selectedPlan) {
        window.location.replace("profile/" + usePage().props.plans[0].id);
    }

    return (
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Profile</h2>}
        >
            <Head title="Profile" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdateSubscriptionForm className="max-w-xl"
                                                selectedPlan={selectedPlan}
                                                clientToken={clientToken}
                                                isSubscribed={isSubscribed}
                        />
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

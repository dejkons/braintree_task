import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link} from '@inertiajs/inertia-react';

export default function Dashboard(props) {

    let plansView = "";
    let plansArea = "";

    if (props.plans !== undefined && props.plans.length > 0) {
        plansView = props.plans.map((plan) => {
            return (<div className="plan-block w-96 border-2 border-slate-200 text-center pt-10 pb-8 inline-block mr-10 hover:drop-shadow-lg"
                         data-id={plan.id} key={plan.id}>
                <p className="text-4xl mb-10">{plan.name}</p>
                <p className="mb-10">{plan.description}</p>
                <p className="mb-10">Price: {plan.price} {plan.currencyIsoCode}</p>
                <Link href={route('profile.edit.plan', {plan: plan.id})} className="text-sm text-gray-700 dark:text-gray-500 underline">
                    Click HERE to subscribe
                </Link>
            </div>);
        });
    }

    plansArea = (!props.isSubscribed) ?
        <>
            <p className="text-center mt-10 text-xl">Do you like what you see so far? Subscribe and get access to advance stats!</p>
            <div className="advanced-stats-plans flex items-center">
                <div className="inline-block ml-auto mr-auto mt-10 mb-10">
                    {plansView}
                </div>
            </div>
        </> :
        <>
            <div className="advanced-stats-placeholder">
                <p className="my-8 text-xl">Advanced Stats Area</p>
                <div className="basic-stats-dummy w-5/5 bg-slate-300 h-96 p-8">
                    Advanced stats placeholder
                </div>
            </div>
        </>

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Stream Stats Dashboard</h2>}
        >
            <Head title="Stream Stats" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="basic-stats-placeholder">
                                <p className="my-8 text-xl">Basic Stats Area</p>
                                <div className="basic-stats-dummy w-5/5 bg-slate-300 h-96 p-8">
                                    Basic stats placeholder
                                </div>
                            </div>
                            {plansArea}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


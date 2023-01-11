import { Link, Head } from '@inertiajs/inertia-react';

export default function Welcome(props) {
    return (
        <>
            <Head title="Advanced Stream Stats | Welcome" />
            <div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">
                <div className="fixed top-0 right-0 px-6 py-4 sm:block">
                    {props.auth.user ? (
                        <Link href={route('dashboard')} className="text-sm text-gray-700 dark:text-gray-500 underline">
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href={route('login')} className="text-sm text-gray-700 dark:text-gray-500 underline">
                                Log in
                            </Link>

                            <Link
                                href={route('register')}
                                className="ml-4 text-sm text-gray-700 dark:text-gray-500 underline"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>

                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-center pt-24 sm:justify-start sm:pt-0 text-4xl">
                        Advanced Stream Stats
                    </div>

                    <div className="mt-8 bg-white dark:bg-gray-800 overflow-hidden shadow sm:rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2">
                            <div className="p-6">
                                <div className="flex items-center">

                                    <div className="ml-4 text-lg leading-7 font-semibold">
                                        <a
                                            href="#"
                                            className="underline text-gray-900 dark:text-white"
                                        >
                                            What do we offer?
                                        </a>
                                    </div>
                                </div>

                                <div className="ml-4">
                                    <div className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod ante ac mollis molestie. Donec ornare odio ligula, sed sagittis risus consectetur in. In ac arcu ac turpis facilisis gravida. Etiam at ligula aliquam orci efficitur cursus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam interdum, nunc vitae sodales finibus, sapien ante mollis dolor, vitae auctor dui magna sed arcu. Donec ac purus vel nulla sollicitudin porta. Nam ut dolor feugiat, fermentum lectus quis, ultricies sem. Etiam sed ex ante.
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-200 dark:border-gray-700 md:border-t-0 md:border-l">
                                <div className="flex items-center">

                                    <div className="ml-4 text-lg leading-7 font-semibold">
                                        <a
                                            href="#"
                                            className="underline text-gray-900 dark:text-white"
                                        >
                                            What's new?
                                        </a>
                                    </div>
                                </div>

                                <div className="ml-4">
                                    <div className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod ante ac mollis molestie. Donec ornare odio ligula, sed sagittis risus consectetur in. In ac arcu ac turpis facilisis gravida. Etiam at ligula aliquam orci efficitur cursus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam interdum, nunc vitae sodales finibus, sapien ante mollis dolor, vitae auctor dui magna sed arcu. Donec ac purus vel nulla sollicitudin porta. Nam ut dolor feugiat, fermentum lectus quis, ultricies sem. Etiam sed ex ante.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center mt-4 sm:items-center sm:justify-between">
                        <div className="ml-4 text-center text-sm text-gray-500 sm:text-right sm:ml-0">
                            Laravel v{props.laravelVersion} (PHP v{props.phpVersion}) - Author Dejan Adamovic
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

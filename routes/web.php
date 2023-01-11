<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BraintreeController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile/{plan}', [BraintreeController::class, 'getPlanDetails'])->name('profile.edit.plan');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::any('/dashboard', [BraintreeController::class, 'getPlans'])->name('dashboard');
    Route::any('/payment/{nonce}/{selectedPlan}', [BraintreeController::class, 'makeTransaction'])->name('payment.transaction');
    Route::get('/profile/getToken/token', [BraintreeController::class, 'getClientToken'])->name('profile.token');

    Route::get('/subscription/cancel', [BraintreeController::class, 'cancelActiveSubscription'])->name('subscription.cancel');
});

require __DIR__.'/auth.php';

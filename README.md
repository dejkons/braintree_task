# Advanced Stream assignement

### Author: Dejan Adamovic
LinkedIn: https://www.linkedin.com/in/dejan-adamovic/

<p style="font-size: 20px;">Things to follow in order to install:</p>
<ul>
<li>Take project from GIT repository</li>
<li>Set .env file in root</li>
<li>Set DB by calling "php artisan migrate"</li>
<li>Set Virtual Host on Apache to align App path with .env path</li>
<li>Add into env credentials for BrainTree, something like:</li>
<ul>
<li>BRAINTREE_ENVIRONMENT=sandbox</li>
<li>BRAINTREE_MERCHANT_ID=...</li>
<li>BRAINTREE_PUBLIC_KEY=...</li>
<li>BRAINTREE_PRIVATE_KEY=...</li>
</ul>
<li>Install composer dependencies</li>
<li>Install npm dependencies</li>
<li>Give write permissions to Laravel storage directory</li>
<li>Include (if missing) packages </li>
<ul>
<li>npm install --save braintree-web</li>
<li>npm install --save braintree-web-drop-in</li>
</ul>
</ul>

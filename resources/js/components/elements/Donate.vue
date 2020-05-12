<template>
    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
        <input type="hidden" name="cmd" value="_donations"/>
        <input type="hidden" name="business" value="KMUWTUGAJTJH4"/>
        <input type="hidden" name="item_name" value="Creating a spoiler free storyline tracker for Gloomhaven!"/>
        <input type="hidden" name="currency_code" value="EUR"/>
        <button class="relative text-light-gray py-1 pl-3 pr-8 border border-light-gray border-solid rounded-full"
                type="submit">
            Buy me a Beer!
            <span class="absolute top-0 right-0 -mt-2 -mr-6 bg-black text-2xl h-12 w-12 leading-12 border-2 border-light-gray border-solid rounded-full">🍻</span>
        </button>
    </form>
</template>

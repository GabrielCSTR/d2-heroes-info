<template>
    <div class="flex items-center justify-center py-4 md:py-5 flex-wrap mt-6 pb-10 main w-full h-full">
        <div v-for="index in 40" :key="index" class="relative w-64 h-36  animate-pulse p-2 shadow-md">
            <div class="w-full h-3/4 bg-gray-200"></div>
            <div class="w-full h-1/4 bg-gray-200"></div>
        </div>
    </div>
</template>
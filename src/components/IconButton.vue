<template>
    <button class="IconButton" :class="modifiers">
        <SvgIcon v-for="iconType in iconTypes" :name="name" :type="iconType" :class="`Icon__inner Icon__inner--${iconType}`" :key="`${name}${iconType}`" />
    </button>
</template>

<script>
import SvgIcon from './SvgIcon.vue';

export default {
    name: "IconButton",
    props: {
        name: {
            default: "home",
            type: String,
        },
        type: {
            default: "full",
            type: String,
        },
        hover: Boolean
    },
    computed: {
        iconTypes() {
            return this.hover
                ? ['outline', ...(this.name === 'heart' ? ['half'] : []), 'full']
                : [this.type] 
        },
        modifiers() {
            const blockClass = "Icon"

            return [
                ...(this.type ? [`${blockClass}--${this.type}`] : []),
                ...(this.hover ? [`${blockClass}--hover`] : [])
            ]
        }
    },
    components: { SvgIcon }
}
</script>

<style lang="scss">
.Icon {
    $block: &;

    display: flex;

    &__inner {
        width: 2rem;
        height: auto;
    }

    &:not(&--hover) {
        @each $type in (outline, full) {
            &#{$block}--#{$type} #{$block}__inner:not(#{$block}__inner--#{$type}) {
                display: none;
            }
        }
    }

    &--hover {
        &:focus:not(:active),
        &:not(:hover):not(:active):not(:focus) {
            @each $opposite, $type in (full: outline, outline: full) {
                &#{$block}--#{$type} #{$block}__inner:not(#{$block}__inner--#{$opposite}) {
                    display: none;
                }
            }
        }

        &:hover:not(:focus),
        &:active:not(:focus),
        &:hover:active:focus {
            #{$block}__inner:not(#{$block}__inner--half) {
                display: none;
            }
        }
    }
}
</style>
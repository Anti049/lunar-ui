<script lang="ts">
	import { cn } from '$lib/utils';

	interface MaskedImageProps {
		src: string;
		alt: string;
		class?: string;
	}

	let { src, alt, class: className = '' }: MaskedImageProps = $props();
</script>

<div
	style="mask-image: url('{src}'); -webkit-mask-image: url('{src}');"
	aria-label={alt}
	role="img"
	class={cn('mask-contain mask-center mask-no-repeat', className)}
></div>

<script lang="ts">
	import { goto } from "$app/navigation";
	import RecentColors from "$lib/components/RecentColors.svelte";
	import SettingSection from "$lib/components/SettingSection.svelte";
	import SettingsLayout from "$lib/components/SettingsLayout.svelte";
	import user_config, { default_value, FONTS } from "$lib/stores/user_config";
	import ColorPicker from "svelte-awesome-color-picker";
</script>

<SettingsLayout>
	<SettingSection
		title="APARIENCIA"
		description="Cambia los estilos de la pagina"
	>
		<!-- Font family -->
		<div class="setting-row">
			<label class="setting-label font-ui">FUENTE</label>
			<select class="setting-input" bind:value={$user_config.font}>
				{#each FONTS as font}
					<option value={font}>{font}</option>
				{/each}
			</select>
		</div>

		<!-- Font size -->
		<div class="setting-row">
			<label class="setting-label font-ui">TAMANO DE FUENTE</label>
			<input
				type="number"
				min="8"
				max="32"
				class="setting-input narrow"
				bind:value={$user_config.font_size}
			/>
		</div>

		<!-- Background color -->
		<div class="setting-row vertical dark">
			<label class="setting-label font-ui">COLOR DE FONDO</label>
			<ColorPicker
				position="responsive"
				textInputModes={['hex']}
				isAlpha={false}
				nullable={false}
				isDialog={false}
				bind:hex={$user_config.background}
				on:input={(event) => {
					user_config.update((config) => {
						config.background = event.detail.hex as string;
						config.background_history.push(event.detail.hex as string);
						return config;
					});
				}}
			/>
			<RecentColors
				colors={$user_config.background_history}
				set_color={(color) => {
					user_config.update((config) => {
						config.background = color;
						return config;
					});
				}}
			/>
		</div>

		<!-- Text color -->
		<div class="setting-row vertical dark">
			<label class="setting-label font-ui">COLOR DEL TEXTO</label>
			<ColorPicker
				position="responsive"
				textInputModes={["hex"]}
				isAlpha={false}
				nullable={false}
				isDialog={false}
				bind:hex={$user_config.color}
				on:input={(event) => {
					user_config.update((config) => {
						config.color = event.detail.hex as string;
						config.color_history.push(event.detail.hex as string);
						return config;
					});
				}}
			/>
			<RecentColors
				colors={$user_config.color_history}
				set_color={(color) => {
					user_config.update((config) => {
						config.color = color;
						return config;
					});
				}}
			/>
		</div>

		<!-- Restore defaults -->
		<div class="setting-row vertical" style="margin-top: 2rem;">
			<button
				class="restore-btn font-ui"
				onclick={async () => {
					user_config.update(() => ({ ...default_value }));
					await goto("/settings");
				}}
			>
				RESTAURAR VALORES POR DEFECTO
			</button>
		</div>
	</SettingSection>
</SettingsLayout>

<style>
	.setting-row {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin: 0.75rem 0;
		width: 100%;
	}

	.setting-row.vertical {
		flex-direction: column;
		align-items: center;
	}

	.setting-label {
		color: var(--text-dim);
		font-size: 11px;
		letter-spacing: 0.15em;
		min-width: 140px;
	}

	.setting-input {
		background: var(--deep);
		border: 1px solid var(--border);
		border-radius: 4px;
		color: var(--text-primary);
		padding: 0.5rem 0.75rem;
		font-family: 'DM Mono', monospace;
		font-size: 13px;
		outline: none;
		transition: border-color 0.25s ease;
	}

	.setting-input:focus {
		border-color: var(--teal-dim);
	}

	.setting-input.narrow {
		max-width: 5rem;
	}

	select.setting-input {
		min-width: 200px;
		cursor: pointer;
	}

	select.setting-input option {
		background: var(--deep);
		color: var(--text-primary);
	}

	.restore-btn {
		background: var(--surface);
		border: 1px solid var(--border);
		color: var(--text-secondary);
		padding: 0.75rem 1.5rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 11px;
		letter-spacing: 0.15em;
		transition: border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
	}

	.restore-btn:hover {
		border-color: var(--teal-dim);
		color: var(--teal);
		box-shadow: var(--glow-teal);
	}

	.dark {
		--cp-bg-color: var(--deep);
		--cp-border-color: var(--surface);
		--cp-text-color: var(--text-primary);
		--cp-input-color: var(--surface);
		--cp-button-hover-color: var(--text-dim);
	}
</style>

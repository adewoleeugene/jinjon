<script lang="ts">
	const socials = [
		{ label: 'WhatsApp', href: 'https://wa.me/23278814080?text=Hello%20Eugene%2C%20I%20came%20across%20your%20portfolio.' },
		{ label: 'GitHub', href: 'https://github.com/' },
		{ label: 'LinkedIn', href: 'https://linkedin.com/in/' },
		{ label: 'Instagram', href: 'https://instagram.com/' },
		{ label: 'Behance', href: 'https://behance.net/' }
	];
</script>

<footer class="contact" id="contact">
	<div class="contact-inner">
		<div class="contact-top">
			<div class="available-badge">
				<span class="badge-dot"></span>
				<span class="badge-text">Available for opportunities</span>
			</div>
		</div>

		<div class="contact-cta">
			<h2 class="contact-heading">
				Let's build<br />
				<span class="contact-heading-accent">something great.</span>
			</h2>
			<div class="contact-emails">
				<a href="mailto:eugene.a.c.john@gmail.com" class="contact-email" data-cursor="Email">
					eugene.a.c.john@gmail.com
				</a>
				<span aria-hidden="true">/</span>
				<a href="mailto:adewoleeugenejohn@gmail.com" class="contact-email" data-cursor="Email">
					adewoleeugenejohn@gmail.com
				</a>
			</div>
		</div>

		<div class="contact-bottom">
			<div class="contact-socials">
				{#each socials as social (social.label)}
					<a
						href={social.href}
						target="_blank"
						rel="noopener noreferrer"
						class="social-link"
						data-cursor={social.label}
					>
						{social.label}
					</a>
				{/each}
			</div>

			<div class="contact-meta">
				<span class="meta-name">Adewole Eugene John</span>
				<span class="meta-copy">© {new Date().getFullYear()}</span>
			</div>
		</div>
	</div>

	<div class="contact-bg-text chapter-number">∞</div>
</footer>

<style>
	.contact {
		position: relative;
		padding: 8rem 2.5rem 4rem;
		border-top: 1px solid var(--border);
		overflow: hidden;
	}

	.contact-inner {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 4rem;
		position: relative;
		z-index: 1;
	}

	.available-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		border: 1px solid var(--border);
		padding: 0.4rem 0.9rem;
		border-radius: 100px;
	}

	.badge-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 6px var(--accent);
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; box-shadow: 0 0 6px var(--accent); }
		50% { opacity: 0.6; box-shadow: 0 0 12px var(--accent); }
	}

	.badge-text {
		font-size: 0.65rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-dim);
	}

	.contact-heading {
		font-size: clamp(3rem, 8vw, 7rem);
		font-weight: 900;
		letter-spacing: -0.03em;
		line-height: 1;
		color: var(--text);
	}

	.contact-heading-accent {
		color: var(--accent);
	}

	.contact-email {
		display: inline-block;
		font-size: clamp(1rem, 2.5vw, 1.5rem);
		color: var(--text-dim);
		border-bottom: 1px solid var(--border);
		padding-bottom: 0.25rem;
		transition: all 0.2s ease;
		letter-spacing: -0.01em;
	}
	.contact-emails { display:flex; align-items:center; flex-wrap:wrap; gap:.7rem; margin-top:2rem; }
	.contact-emails > span { color:var(--accent); font-size:1rem; }

	.contact-email:hover {
		color: var(--accent);
		border-color: var(--accent);
	}

	.contact-bottom {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		flex-wrap: wrap;
		gap: 2rem;
		padding-top: 2rem;
		border-top: 1px solid var(--border);
	}

	.contact-socials {
		display: flex;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.social-link {
		font-size: 0.7rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-dim);
		transition: color 0.2s ease;
	}

	.social-link:hover {
		color: var(--accent);
	}

	.contact-meta {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.25rem;
	}

	.meta-name {
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--text);
	}

	.meta-copy {
		font-size: 0.65rem;
		color: var(--muted);
		letter-spacing: 0.1em;
	}

	.contact-bg-text {
		position: absolute;
		right: -3rem;
		bottom: -4rem;
		font-size: 30rem;
		opacity: 0.03;
		line-height: 1;
	}

	@media (max-width: 768px) {
		.contact {
			padding: 5rem 1.5rem 3rem;
		}

		.contact-bottom {
			flex-direction: column;
			align-items: flex-start;
		}

		.contact-meta {
			align-items: flex-start;
		}
		.contact-emails { align-items:flex-start; flex-direction:column; gap:.45rem; }
		.contact-emails > span { display:none; }
	}
</style>

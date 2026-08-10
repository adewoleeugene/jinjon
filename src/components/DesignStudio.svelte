<script lang="ts">
	import type { DesignCategory, Project } from '$lib/content/types';
	import { designReveal } from '$lib/stores/designReveal';

	let { projects, categories }: { projects: Project[]; categories: DesignCategory[] } = $props();
</script>

<section class="design-world" id="chapter-design" aria-labelledby="design-title">
	<div class="studio" class:visible={$designReveal}>
		<header class="studio-intro">
			<div class="intro-meta"><span>04 / Design Studio</span><span>Freetown — Sierra Leone</span></div>
			<div class="intro-copy">
				<p class="kicker">A space for visual ideas</p>
				<h2 id="design-title">Make it<br /><em>felt.</em></h2>
				<p class="statement">Logos, identities, flyers and digital experiences—shaped until an idea has a voice people can recognise.</p>
			</div>
			<div class="studio-stamp" aria-hidden="true">AEJ<br /><span>VISUAL</span></div>
		</header>

		<nav class="category-index" aria-label="Design disciplines">
			<span>Explore disciplines</span>
			<div>
				{#each categories as category, i (category.id)}
					<a href="#design-{category.id}">{String(i + 1).padStart(2, '0')} {category.title}</a>
				{/each}
			</div>
		</nav>

		<div class="category-stack">
			{#each categories as category, i (category.id)}
				{@const categoryProjects = projects.filter((project) => category.projectIds.includes(project.id))}
				<div class="category-track" style="--stack-index:{i}">
					<section class="category-panel tone-{i % 2}" id="design-{category.id}" aria-labelledby="category-{category.id}">
						<header class="category-copy">
							<p class="category-number">Discipline {String(i + 1).padStart(2, '0')}</p>
							<p class="category-eyebrow">{category.eyebrow}</p>
							<h3 id="category-{category.id}">{category.title}</h3>
							<p class="category-description">{category.description}</p>
							<span class="project-count">{String(categoryProjects.length).padStart(2, '0')} selected projects</span>
						</header>

						<div class="project-shelf">
							{#each categoryProjects as project, projectIndex (project.id)}
								<a class="project" href="/work/{project.slug}" data-cursor="View" aria-label="Open {project.title}">
									<div class="project-art">
										{#if project.media}
											{#if project.mediaType === 'video'}
												<video src={project.media} muted playsinline></video>
											{:else}
												<img src={project.media} alt={project.title} />
											{/if}
										{:else}
											<div class="placeholder">
												<span>AEJ® / {String(projectIndex + 1).padStart(2, '0')}</span>
												<strong>{project.title}</strong>
												<i>{project.title.charAt(0)}</i>
											</div>
										{/if}
									</div>
									<div class="project-meta"><div><small>{project.tags.join(' · ')}</small><h4>{project.title}</h4></div><span>{project.year}<br />↗</span></div>
								</a>
							{:else}
								<p class="category-empty">Projects coming soon.</p>
							{/each}
							<span class="annotation final-note" aria-hidden="true">final direction ↗</span>
							<span class="annotation discipline-note" aria-hidden="true">{category.title}</span>
						</div>
					</section>
				</div>
			{/each}
		</div>

		<footer><span>AEJ Design Studio</span><span>Ideas made visible.</span></footer>
	</div>
</section>

<style>
	.design-world { position:relative; left:50%; z-index:4; width:100vw; margin-top:-100svh; margin-left:-50vw; background:transparent; }
	.studio { min-height:100vh; overflow:visible; background:var(--bg); color:var(--text); opacity:0; transform:translateY(28px); transition:opacity .9s ease,transform 1.1s cubic-bezier(.2,.8,.2,1); }
	.studio.visible { opacity:1; transform:none; }
	.studio-intro { position:sticky; z-index:0; top:5.25rem; min-height:100svh; padding:clamp(1.5rem,3vw,3rem) clamp(1.25rem,5vw,5rem); display:flex; flex-direction:column; justify-content:space-between; background:var(--bg); color:var(--text); }
	.studio-intro::after { content:''; position:absolute; left:clamp(1.25rem,5vw,5rem); bottom:9%; width:23%; height:1px; background:var(--border); transform:rotate(-8deg); transform-origin:left; }
	.intro-meta { display:flex; justify-content:space-between; border-top:1px solid var(--border); padding-top:.7rem; font-family:'JetBrains Mono',monospace; font-size:.55rem; letter-spacing:.14em; text-transform:uppercase; }
	.intro-copy { width:min(92%,1250px); margin:auto; display:grid; grid-template-columns:.35fr 1fr .55fr; align-items:end; gap:clamp(1.5rem,5vw,6rem); }
	.kicker { align-self:start; padding-top:1rem; border-top:1px solid currentColor; font-family:'JetBrains Mono',monospace; font-size:.58rem; letter-spacing:.13em; text-transform:uppercase; }
	.intro-copy h2 { font-size:clamp(6rem,14vw,15rem); line-height:.67; letter-spacing:-.09em; text-transform:uppercase; }
	.intro-copy h2 em { padding-inline:.07em; background:var(--bg); color:var(--accent); font-family:'Playfair Display',Georgia,serif; font-weight:400; text-transform:none; }
	.statement { max-width:34ch; padding-bottom:.5rem; font-size:clamp(1rem,1.4vw,1.35rem); line-height:1.55; }
	.studio-stamp { position:absolute; right:5%; bottom:7%; width:110px; aspect-ratio:1; display:grid; place-content:center; border:2px solid var(--accent); border-radius:50%; transform:rotate(9deg); background:transparent; color:var(--text); font-size:1.8rem; font-weight:800; line-height:.75; text-align:center; }
	.studio-stamp span { font-family:'JetBrains Mono',monospace; font-size:.45rem; letter-spacing:.18em; }

	.category-index { display:flex; justify-content:space-between; gap:2rem; padding:1.1rem clamp(1.25rem,5vw,5rem); border-block:1px solid var(--border); background:var(--bg); color:var(--text); font-family:'JetBrains Mono',monospace; font-size:.55rem; letter-spacing:.1em; text-transform:uppercase; }
	.category-index div { display:flex; flex-wrap:wrap; justify-content:flex-end; gap:1.2rem; }
	.category-index a { color:var(--text-dim); }
	.category-index a:hover { color:var(--accent); }

	.category-stack { --stack-top:5.25rem; --stack-gap:clamp(1.65rem,2.4vw,2.5rem); --stack-overlap:120svh; position:relative; background:var(--bg); }
	.category-track { position:relative; height:155svh; }
	.category-track:not(:last-child) { height:calc(155svh + var(--stack-overlap)); margin-bottom:calc(-1 * var(--stack-overlap)); }
	.category-track:last-child { height:calc(100svh - var(--stack-top) + (var(--stack-gap) * (var(--stack-index) + 1))); }
	.category-panel { position:sticky; z-index:calc(var(--stack-index) + 1); top:calc(var(--stack-top) + (var(--stack-index) * var(--stack-gap))); min-height:calc(100svh - var(--stack-top) - (var(--stack-index) * var(--stack-gap))); display:grid; grid-template-columns:minmax(17rem,.62fr) minmax(0,1.38fr); overflow:hidden; border:1px solid var(--border); border-bottom:0; border-radius:clamp(1.4rem,2.3vw,2.5rem) clamp(1.4rem,2.3vw,2.5rem) 0 0; box-shadow:0 -12px 34px rgba(0,0,0,.24); }
	.tone-0 { background:var(--bg); color:var(--text); }
	.tone-1 { background:var(--bg); color:var(--text); }
	.category-copy { display:flex; flex-direction:column; justify-content:center; padding:clamp(2rem,5vw,6rem); }
	.category-track:nth-child(even) .category-panel { grid-template-columns:minmax(0,1.38fr) minmax(17rem,.62fr); }
	.category-track:nth-child(even) .category-copy { order:2; }
	.category-number,.category-eyebrow,.project-count { font-family:'JetBrains Mono',monospace; font-size:.62rem; letter-spacing:.14em; text-transform:uppercase; }
	.category-number { color:var(--accent); }
	.category-eyebrow,.project-count { color:var(--text-dim); }
	.category-eyebrow { margin-top:auto; opacity:.6; }
	.category-copy h3 { max-width:8ch; margin:1rem 0 1.5rem; font-size:clamp(3.5rem,7vw,8rem); font-weight:900; line-height:.82; letter-spacing:-.07em; text-transform:uppercase; }
	.category-description { max-width:38ch; color:var(--text-dim); font-size:clamp(.95rem,1.2vw,1.15rem); line-height:1.6; }
	.project-count { margin-top:auto; padding-top:2rem; border-top:1px solid currentColor; }
	.project-shelf { position:relative; min-width:0; display:grid; grid-auto-flow:column; grid-auto-columns:minmax(330px,58%); align-items:center; justify-content:center; gap:clamp(1.5rem,3vw,3rem); padding:clamp(2rem,5vw,6rem); overflow-x:auto; overscroll-behavior-inline:contain; scrollbar-width:thin; }
	.project { color:inherit; }
	.project-art { position:relative; aspect-ratio:4/5; overflow:hidden; border:1px solid var(--text-dim); background:var(--bg); color:var(--text); box-shadow:0 25px 60px rgba(0,0,0,.24); transform:rotate(-3deg); transition:transform .4s ease; }
	.tone-1 .project-art { background:var(--text); color:var(--bg); }
	.project::before { content:''; position:absolute; width:58%; aspect-ratio:4/5; transform:translate(14%,5%) rotate(7deg); border:1px solid var(--text-dim); background:transparent; }
	.project { position:relative; color:inherit; }
	.project:hover .project-art { transform:translateY(-8px) rotate(0); }
	.project-art img,.project-art video { width:100%; height:100%; object-fit:cover; }
	.placeholder { position:absolute; inset:0; display:flex; flex-direction:column; justify-content:space-between; padding:8%; overflow:hidden; }
	.placeholder::after { content:''; position:absolute; inset:8%; border:1px solid currentColor; opacity:.2; }
	.placeholder span { position:relative; z-index:1; font-family:'JetBrains Mono',monospace; font-size:.48rem; letter-spacing:.12em; }
	.placeholder strong { position:relative; z-index:1; max-width:7ch; font-size:clamp(2.4rem,4vw,5rem); line-height:.8; letter-spacing:-.07em; text-transform:uppercase; }
	.placeholder i { position:absolute; right:-.08em; bottom:-.3em; font-family:'Playfair Display',Georgia,serif; font-size:clamp(13rem,20vw,22rem); font-weight:400; line-height:1; opacity:.12; }
	.project-meta { display:flex; justify-content:space-between; gap:1rem; margin-top:1.2rem; padding-top:.8rem; border-top:1px solid currentColor; }
	.project-meta small { font-family:'JetBrains Mono',monospace; font-size:.46rem; letter-spacing:.1em; text-transform:uppercase; opacity:.6; }
	.project-meta h4 { margin-top:.45rem; font-size:clamp(1.4rem,2.2vw,2.3rem); line-height:.95; }
	.project-meta>span { padding:.15rem .35rem; background:var(--bg); color:var(--accent); font-family:'JetBrains Mono',monospace; font-size:.52rem; line-height:2; text-align:right; }
	.tone-1 .project-meta>span { background:var(--accent); color:var(--bg); }
	.annotation { position:absolute; z-index:2; font-family:'Playfair Display',Georgia,serif; font-size:clamp(1rem,1.6vw,1.5rem); font-style:italic; pointer-events:none; }
	.final-note { right:4%; top:12%; transform:rotate(7deg); }
	.discipline-note { left:4%; bottom:13%; transform:rotate(-7deg); }
	.category-empty { place-self:center; font-family:'Playfair Display',Georgia,serif; font-size:2rem; font-style:italic; }
	footer { display:flex; justify-content:space-between; padding:1.25rem clamp(1.25rem,5vw,5rem); border-top:4px solid var(--accent); background:var(--bg); color:var(--text); font-family:'JetBrains Mono',monospace; font-size:.53rem; letter-spacing:.12em; text-transform:uppercase; }

	@media(max-width:900px){
		.intro-copy { grid-template-columns:1fr; align-items:start; }
		.intro-copy h2 { order:-1; }
		.kicker { max-width:15rem; }
		.statement { justify-self:end; }
		.category-panel { grid-template-columns:1fr; }
		.category-track:nth-child(even) .category-panel { grid-template-columns:1fr; }
		.category-track:nth-child(even) .category-copy { order:0; }
		.category-copy { min-height:42svh; border-bottom:1px solid var(--text-dim); }
		.category-eyebrow { margin-top:2rem; }
		.project-shelf { grid-auto-columns:minmax(270px,78%); min-height:58svh; }
	}
	@media(max-width:620px){
		.studio-intro { top:4.5rem; min-height:90svh; }
		.intro-meta,footer { gap:1rem; }
		.intro-meta span:last-child { text-align:right; }
		.studio-stamp { width:75px; }
		.category-index { flex-direction:column; }
		.category-index div { justify-content:flex-start; }
		.category-stack { --stack-top:4.5rem; --stack-gap:1.35rem; }
		.category-copy h3 { font-size:clamp(3.2rem,15vw,5rem); }
		.annotation { display:none; }
	}
	@media(prefers-reduced-motion:reduce){
		.design-world { margin-top:0; }
		.studio { opacity:1; transform:none; transition:none; }
		.project-art { transition:none; }
	}
</style>

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDown, ArrowRight, X, MoveUpRight, Pause, Play, Code2 } from 'lucide-react';

const chapters = ['Início', 'Perfil', 'Código', 'Rugby', 'Contacto'];
const cameras = [
  { x: .36, y: .49, zoom: 1 },
  { x: .23, y: .43, zoom: 1.38 },
  { x: .53, y: .63, zoom: 1.85 },
  { x: .47, y: .37, zoom: 1.2 },
  { x: .36, y: .49, zoom: 1 },
];
const experience = [
  ['NOV 2025 — PRESENTE', 'Accenture', 'Estágio profissional · conclusão prevista em fevereiro de 2027.'],
  ['JAN — JUL 2025', 'TSR Sistemas de Informação', 'Estágio profissional +Talento.'],
];
const training = [
  ['SET 2026 — PRESENTE', 'React', 'Curso · Udacity'],
  ['MAI — JUN 2026', 'SAP UI5 / Fiori Dev Hub', 'Formação · Accenture'],
  ['ABR — MAI 2026', 'SAP CPI', 'Formação · Accenture'],
  ['NOV 2025 — FEV 2026', 'SAP ABAP', 'Formação · IT Gest / Accenture'],
  ['2019 — PRESENTE', 'Engenharia e Gestão de Sistemas de Informação', 'Mestrado Integrado · Universidade do Minho'],
];

export default function Portfolio() {
  const [position, setPosition] = useState(0);
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [dialog, setDialog] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const active = Math.min(4, Math.max(0, Math.round(position)));
  const mobile = size.w < 760;

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setPosition(Math.min(4, window.scrollY / window.innerHeight)));
    };
    const resize = () => { setSize({ w: window.innerWidth, h: window.innerHeight }); onScroll(); };
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduced(media.matches);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);
    media.addEventListener('change', change);
    onScroll();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', resize); media.removeEventListener('change', change); };
  }, []);

  const go = useCallback((i: number) => window.scrollTo({ top: Math.max(0, Math.min(4, i)) * window.innerHeight, behavior: reduced ? 'instant' : 'smooth' }), [reduced]);
  useEffect(() => {
    const keys = (e: KeyboardEvent) => {
      if (dialog || (e.target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'BUTTON', 'A'].includes(e.target.tagName))) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); go(active + 1); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); go(active - 1); }
      if (e.key === 'Home') { e.preventDefault(); go(0); }
      if (e.key === 'End') { e.preventDefault(); go(4); }
    };
    window.addEventListener('keydown', keys);
    return () => window.removeEventListener('keydown', keys);
  }, [active, go, dialog]);

  useEffect(() => {
    if (dialog) dialogRef.current?.showModal();
    else dialogRef.current?.close();
    const node = dialogRef.current;
    const backdrop = (e: MouseEvent) => {
      if (e.target !== node || !node) return;
      const rect = node.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) setDialog(false);
    };
    node?.addEventListener('click', backdrop);
    return () => node?.removeEventListener('click', backdrop);
  }, [dialog]);

  const p = reduced ? 0 : position;
  const lower = Math.min(3, Math.floor(p));
  const t = p - lower;
  const ease = t * t * (3 - 2 * t);
  const a = cameras[lower], b = cameras[lower + 1];
  const cam = { x: a.x + (b.x - a.x) * ease, y: a.y + (b.y - a.y) * ease, zoom: a.zoom + (b.zoom - a.zoom) * ease };
  const imageW = (mobile ? Math.max(size.w, size.h * .666) : Math.max(size.w * .70, size.h * .666)) * cam.zoom;
  const imageH = imageW * 1600 / 1066;
  const imageX = Math.min(0, size.w * (mobile ? .48 : .29) - cam.x * imageW);
  const imageY = size.h * (mobile ? .35 : .50) - cam.y * imageH;
  const point = (x: number, y: number) => ({ left: imageX + x * imageW, top: imageY + y * imageH });

  return (
    <main className="journey" style={{ height: '500vh' }}>
      <a className="skip-link" href="#chapter-content">Saltar para o conteúdo</a>
      <div className={`stage chapter-${active}${reduced ? ' reduced-motion' : ''}`}>
        <div className="photograph" aria-hidden="true">
          <img src="/images/rugby-hugo.jpg" alt="" style={{ width: imageW, height: imageH, transform: `translate3d(${imageX}px,${imageY}px,0)` }} />
        </div>
        <div className="photo-shade" />
        <div className="grain" />

        <header className="site-header">
          <button className="wordmark" onClick={() => go(0)} aria-label="Hugo Neves, início">HN<span>↗</span></button>
          <span className="header-caption">HUGO NEVES<br /><span>PORTFÓLIO PESSOAL</span></span>
          <nav className="top-nav" aria-label="Capítulos">
            {chapters.slice(1, 4).map((label, i) => <button key={label} className={active === i + 1 ? 'selected' : ''} onClick={() => go(i + 1)}>{label}</button>)}
            <button className={`contact-nav ${active === 4 ? 'selected' : ''}`} onClick={() => go(4)}>Vamos falar <ArrowUpRight size={15} /></button>
          </nav>
        </header>

        {active === 0 && <div className="hotspots" aria-label="Explorar a fotografia">
          <button className="hotspot player" style={point(.25, .37)} onClick={() => go(1)} aria-label="Focar no jogador e conhecer Hugo"><span className="target">+</span><span className="point-label">01 / O JOGADOR</span></button>
          <button className="hotspot ball" style={point(.53, .625)} onClick={() => go(2)} aria-label="Focar na bola e ver experiência em programação"><span className="target">+</span><span className="point-label">02 / O PROGRAMADOR</span></button>
          <button className="hotspot field" style={point(.66, .30)} onClick={() => go(3)} aria-label="Explorar o rugby"><span className="target">+</span><span className="point-label">03 / O PERCURSO</span></button>
        </div>}

        <section id="chapter-content" className="chapter-content" aria-label={chapters[active]} tabIndex={-1}>
          <div className="chapter-inner" key={active}>
            <div className="eyebrow"><span className="live-dot" />{['PROGRAMADOR. JOGADOR. SEMPRE EM MOVIMENTO.', '01 / A PESSOA POR TRÁS DO JOGO', '02 / FORA DE CAMPO', '03 / DENTRO DE CAMPO', '04 / O PRÓXIMO PASSO'][active]}</div>
            {active === 0 && <>
              <h1>HUGO<br /><span>NEVES</span><sup>↗</sup></h1>
              <div className="intro-line"><span>01 — 05</span><i /></div>
              <h2 className="tagline">Dentro e fora de campo.<br />A mesma dedicação.</h2>
              <p>Escrevo código. Jogo rugby.<br />Em ambos, construo com uma equipa.</p>
              <button className="primary-action" onClick={() => go(1)}>Explorar o meu percurso <ArrowDown size={18} /></button>
              <div className="location">GUIMARÃES, PORTUGAL <span>41.44° N / 8.29° W</span></div>
            </>}
            {active === 1 && <>
              <h2 className="display-title">MENTE DE<br />PROGRAMADOR.<br /><em>ESPÍRITO<br />DE EQUIPA.</em></h2>
              <p>Sou o Hugo. Trabalho em programação e jogo rugby no meu tempo livre. Comecei aos 6 anos — e a vontade de aprender nunca saiu de campo.</p>
              <p>Dedicação, trabalho em equipa e foco nos objetivos: é assim que encaro o jogo e cada desafio profissional.</p>
              <div className="facts"><div><strong>6<span>anos</span></strong><small>QUANDO COMECEI NO RUGBY</small></div><div><strong>UMinho</strong><small>ENG. E GESTÃO DE SIST. DE INFORMAÇÃO</small></div></div>
              <button className="text-action" onClick={() => go(2)}>Conhecer o lado técnico <ArrowRight size={18} /></button>
            </>}
            {active === 2 && <>
              <h2 className="display-title">OUTRO CAMPO.<br /><em>A MESMA<br />ENTREGA.</em></h2>
              <p>Da lógica ao resultado. O meu percurso cruza desenvolvimento web, sistemas de informação e o ecossistema SAP.</p>
              <div className="career-preview">{experience.map(([date, title, detail]) => <div className="career-row" key={title}><small>{date}</small><strong>{title}</strong><span>{detail.split(' · ')[0]}</span></div>)}</div>
              <div className="skill-chips">{['React', 'JavaScript', 'SAP ABAP', 'SAP CPI', 'SAP UI5', 'Java', 'C#', 'HTML'].map(s => <span key={s}>{s}</span>)}</div>
              <button className="text-action" onClick={() => setDialog(true)}>Experiência e formação completas <ArrowUpRight size={18} /></button>
            </>}
            {active === 3 && <>
              <h2 className="display-title">O JOGO<br />FAZ PARTE<br /><em>DE MIM.</em></h2>
              <p>Rugby desde os 6 anos. Uma escola de compromisso, resiliência e trabalho em equipa — dentro e fora das quatro linhas.</p>
              <div className="achievements">
                <div><span>2018 / 19</span><p><strong>Vice-campeão nacional</strong><br />Sub-18 · 2.ª divisão</p><MoveUpRight size={17} /></div>
                <div><span>2013 — 19</span><p><strong>Seleção regional</strong><br />Escalões Sub-14, Sub-16 e Sub-18</p><MoveUpRight size={17} /></div>
                <div><span>2016 / 17</span><p><strong>Vice-campeão nacional de sevens</strong><br />Sub-16 · 2.ª divisão</p><MoveUpRight size={17} /></div>
              </div>
              <div className="interests"><small>PARA ALÉM DO RUGBY</small><span>Programação / Desporto / Videojogos</span></div>
            </>}
            {active === 4 && <>
              <h2 className="display-title">AS BOAS<br />IDEIAS JOGAM<br /><em>EM EQUIPA.</em></h2>
              <p>Um desafio técnico, uma nova oportunidade ou uma conversa sobre rugby. Vamos começar por uma mensagem.</p>
              <a className="primary-action" href="mailto:hugomxnmneves@gmail.com">Entrar em contacto <ArrowUpRight size={19} /></a>
              <a className="email-link" href="mailto:hugomxnmneves@gmail.com">hugomxnmneves@gmail.com</a>
              <div className="contact-details"><span>GUIMARÃES, PORTUGAL</span><span>Português / Inglês / Espanhol</span></div>
              <button className="text-action" onClick={() => go(0)}>Voltar ao início <ArrowUpRight size={17} /></button>
            </>}
          </div>
        </section>

        <div className="photo-note"><span className="small-cross">+</span> UM INSTANTE EM CAMPO.<br /><span>UMA HISTÓRIA PARA EXPLORAR.</span></div>
        <footer className="journey-footer">
          <button className="motion-toggle" onClick={() => setReduced(!reduced)} aria-pressed={reduced} aria-label={reduced ? 'Ativar movimento da fotografia' : 'Reduzir movimento da fotografia'}>{reduced ? <Play size={12} /> : <Pause size={12} />}<span>{reduced ? 'MOVIMENTO PAUSADO' : 'EXPLORAR COM SCROLL'}</span></button>
          <nav className="chapter-track" aria-label="Navegação do percurso">{chapters.map((label, i) => <button key={label} className={active === i ? 'active' : ''} aria-current={active === i ? 'step' : undefined} onClick={() => go(i)}><span className="track-number">0{i + 1}</span><span className="track-label">{label}</span><span className="track-line" /></button>)}</nav>
          <button className="next-chapter" onClick={() => go(active === 4 ? 0 : active + 1)} aria-label={active === 4 ? 'Voltar ao início' : `Próximo capítulo: ${chapters[active + 1]}`}><ArrowRight size={21} /></button>
        </footer>
        <div className="scroll-progress" style={{ width: `${position / 4 * 100}%` }} />
      </div>

      <dialog ref={dialogRef} className="cv-dialog" onCancel={() => setDialog(false)} onClose={() => setDialog(false)} aria-labelledby="cv-title">
        <div className="dialog-head"><span className="eyebrow"><Code2 size={15} /> O MEU PERCURSO</span><button onClick={() => setDialog(false)} aria-label="Fechar percurso"><X size={22} /></button></div>
        <h2 id="cv-title">EXPERIÊNCIA<br /><em>& FORMAÇÃO.</em></h2>
        <h3>Experiência profissional</h3>
        {experience.map(([date, title, detail]) => <div className="timeline-row" key={title}><small>{date}</small><div><h4>{title}</h4><p>{detail}</p></div></div>)}
        <h3>Formação e qualificações</h3>
        {training.map(([date, title, detail]) => <div className="timeline-row" key={title}><small>{date}</small><div><h4>{title}</h4><p>{detail}</p></div></div>)}
        <h3>Competências</h3><div className="skill-chips">{['HTML', 'JavaScript', 'Java', 'C#', 'React', 'SAP ABAP', 'SAP CPI', 'SAP UI5', 'XSL', 'Gestão de projetos', 'Desenho de processos'].map(s => <span key={s}>{s}</span>)}</div>
        <h3>Idiomas</h3><p>Português · Inglês · Espanhol</p>
        <p className="cv-source">Informação baseada no currículo de Hugo Neves.</p>
      </dialog>
    </main>
  );
}
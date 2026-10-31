const toggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('#nav-list');

if (toggle && navList) {
  toggle.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

document.querySelectorAll('.services-trigger').forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    const item = trigger.closest('.services-menu');
    const open = item.classList.toggle('open');
    trigger.setAttribute('aria-expanded', String(open));
  });
});

document.addEventListener('click', (event) => {
  document.querySelectorAll('.services-menu.open').forEach((item) => {
    if (!item.contains(event.target)) {
      item.classList.remove('open');
      item.querySelector('.services-trigger')?.setAttribute('aria-expanded', 'false');
    }
  });
});

const CART_KEY = 'livesRediscoveredCart';

function readCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

function writeCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount(cart);
}

function updateCartCount(cart = readCart()) {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach((element) => {
    element.textContent = String(count);
  });
}

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

document.querySelectorAll('.add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const cart = readCart();
    const existing = cart.find((item) => item.id === button.dataset.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: button.dataset.id,
        name: button.dataset.name,
        detail: button.dataset.detail,
        price: Number(button.dataset.price),
        quantity: 1
      });
    }
    writeCart(cart);
    window.location.href = `cart.html?added=${encodeURIComponent(button.dataset.name)}`;
  });
});

function renderCart() {
  const container = document.querySelector('#cart-items');
  if (!container) return;

  const cart = readCart();
  const empty = document.querySelector('#empty-cart');
  const checkout = document.querySelector('#checkout-button');
  container.replaceChildren();

  if (cart.length === 0) {
    empty.hidden = false;
    checkout.classList.add('disabled');
    checkout.setAttribute('aria-disabled', 'true');
  } else {
    empty.hidden = true;
    checkout.classList.remove('disabled');
    checkout.removeAttribute('aria-disabled');
  }

  cart.forEach((item) => {
    const row = document.createElement('article');
    row.className = 'cart-row';
    row.dataset.id = String(item.id ?? '');

    const product = document.createElement('div');
    product.className = 'cart-product';
    const remove = document.createElement('button');
    remove.className = 'remove-item';
    remove.type = 'button';
    remove.setAttribute('aria-label', `Remove ${String(item.name ?? '')}`);
    remove.textContent = '×';
    const name = document.createElement('p');
    name.className = 'cart-product-name';
    name.append(document.createTextNode(String(item.name ?? '')));
    const detail = document.createElement('span');
    detail.className = 'cart-product-detail';
    detail.textContent = String(item.detail ?? '');
    name.append(detail);
    product.append(remove, name);

    const price = document.createElement('div');
    price.className = 'cart-price';
    price.textContent = formatMoney(item.price);

    const quantityColumn = document.createElement('div');
    const controls = document.createElement('div');
    controls.className = 'quantity-control';
    controls.setAttribute('aria-label', `Quantity for ${String(item.name ?? '')}`);
    const decrease = document.createElement('button');
    decrease.type = 'button';
    decrease.dataset.action = 'decrease';
    decrease.setAttribute('aria-label', 'Decrease quantity');
    decrease.textContent = '−';
    const quantity = document.createElement('span');
    quantity.setAttribute('aria-live', 'polite');
    quantity.textContent = String(item.quantity);
    const increase = document.createElement('button');
    increase.type = 'button';
    increase.dataset.action = 'increase';
    increase.setAttribute('aria-label', 'Increase quantity');
    increase.textContent = '+';
    controls.append(decrease, quantity, increase);
    quantityColumn.append(controls);

    const lineTotal = document.createElement('div');
    lineTotal.className = 'cart-line-total';
    lineTotal.textContent = formatMoney(item.price * item.quantity);
    row.append(product, price, quantityColumn, lineTotal);
    container.append(row);
  });

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  document.querySelector('#cart-item-count').textContent = String(itemCount);
  document.querySelector('#cart-subtotal').textContent = formatMoney(subtotal);
  document.querySelector('#cart-total').textContent = formatMoney(subtotal);
  updateCartCount(cart);

  const params = new URLSearchParams(window.location.search);
  const added = params.get('added');
  const notice = document.querySelector('#cart-notice');
  if (added && notice) {
    document.querySelector('#notice-item').textContent = added;
    notice.hidden = false;
  }
}

document.querySelector('#cart-items')?.addEventListener('click', (event) => {
  const row = event.target.closest('.cart-row');
  if (!row) return;
  const cart = readCart();
  const index = cart.findIndex((item) => item.id === row.dataset.id);
  if (index < 0) return;

  if (event.target.closest('.remove-item')) {
    cart.splice(index, 1);
  } else if (event.target.dataset.action === 'increase') {
    cart[index].quantity += 1;
  } else if (event.target.dataset.action === 'decrease') {
    cart[index].quantity -= 1;
    if (cart[index].quantity < 1) cart.splice(index, 1);
  } else {
    return;
  }

  writeCart(cart);
  renderCart();
});

const contactForm = document.querySelector('#contact-form');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  document.querySelector('#form-status').textContent = 'Thank you. Your message is ready for delivery once the site’s email service is connected.';
});

updateCartCount();
renderCart();

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  document.querySelectorAll('.services-menu.open').forEach(item => {
    item.classList.remove('open');
    const trigger = item.querySelector('.services-trigger');
    trigger?.setAttribute('aria-expanded','false');
    trigger?.focus();
  });
  if (navList?.classList.contains('open')) {
    navList.classList.remove('open');
    toggle?.setAttribute('aria-expanded','false');
    toggle?.focus();
  }
});


function buildCelestialBanners() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.navy-band').forEach((band) => {
    band.querySelector('.star-field')?.remove();

    const field = document.createElement('div');
    field.className = 'star-field';

    const width = band.clientWidth || window.innerWidth || 1200;
    const baseStarCount = width < 600 ? 115 : 180;
    const starCount = band.matches('.mission-section') ? Math.round(baseStarCount * 1.3) : baseStarCount;

    for (let i = 0; i < starCount; i += 1) {
      const star = document.createElement('span');
      star.className = 'twinkle-star';

      const x = (Math.random() * 100).toFixed(2) + '%';
      const y = (6 + Math.random() * 88).toFixed(2) + '%';
      const size = (1.4 + Math.random() * 2.2).toFixed(2) + 'px';
      const duration = (2 + Math.random() * 6).toFixed(2) + 's';
      const delay = (-Math.random() * 18).toFixed(2) + 's';
      const minOpacity = (0.09 + Math.random() * 0.15).toFixed(2);
      const midOpacity = (0.35 + Math.random() * 0.22).toFixed(2);
      const maxOpacity = (0.78 + Math.random() * 0.22).toFixed(2);
      const glow = (7 + Math.random() * 10).toFixed(2) + 'px';

      star.style.setProperty('--x', x);
      star.style.setProperty('--y', y);
      star.style.setProperty('--size', size);
      star.style.setProperty('--duration', reducedMotion ? '0s' : duration);
      star.style.setProperty('--delay', delay);
      star.style.setProperty('--min-opacity', minOpacity);
      star.style.setProperty('--mid-opacity', midOpacity);
      star.style.setProperty('--max-opacity', maxOpacity);
      star.style.setProperty('--glow', glow);

      field.appendChild(star);
    }

    band.appendChild(field);
  });
}

buildCelestialBanners();
window.addEventListener('resize', () => {
  clearTimeout(window.__lrStarResizeTimer);
  window.__lrStarResizeTimer = setTimeout(buildCelestialBanners, 180);
});


// V6.1 — About/Education footsteps. Independent of the celestial banner code.
(function initializeEducationMap() {
  const map = document.querySelector('.about-page .education-map');
  if (!map) return;
  const stops = [...map.querySelectorAll('[data-education-stop]')];
  const svg = map.querySelector('.education-route');
  const path = map.querySelector('.education-route-line');
  const prints = map.querySelector('.education-footprints');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = false, generation = 0, timeoutId;
  const sleep = ms => new Promise(resolve => { timeoutId = setTimeout(resolve, ms); });

  const paintedMapSize = { width:1024, height:1536 };
  // V6.41 waypoints in image coordinates (1024 x 1536), aligned more closely
  // with the visible roads, walkways, and bridge approaches on the approved map.
  const campusWalkways = [
    // CCC forecourt to NAU: approach road, bridge crossing, then the Skydome path.
    [[312,236],[295,284],[258,334],[225,384],[219,436],[267,479],[334,503],[428,507],[535,454],[658,432]],
    // NAU to BYU: skirt Ashurst, descend to the creek bridge, then into the central walk.
    [[751,604],[710,633],[651,676],[605,718],[565,760],[569,786],[531,808],[477,831],[420,854]],
    // BYU to 2023 Strath: garden-side walk into the long central descent toward Barony Hall.
    [[498,928],[523,985],[503,1042],[463,1090],[423,1129],[376,1161],[315,1177]],
    // 2023 to 2024: pass south of Barony Hall and then curve up around Livingstone Tower.
    [[323,1211],[377,1199],[448,1192],[520,1195],[588,1197],[646,1183],[699,1160]],
    // 2024 to 2026: descend the lower tower-side walk and finish below Barony Hall.
    [[690,1244],[658,1290],[618,1331],[567,1366],[514,1392],[470,1418]]
  ];

  function route() {
    const bounds = map.getBoundingClientRect();
    const w=bounds.width, h=bounds.height;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const targets = stops.map(stop => {
      const r = stop.querySelector('.education-marker').getBoundingClientRect();
      return { x: r.left-bounds.left+r.width/2, y: r.top-bounds.top+r.height/2 };
    });
    const xScale = w / paintedMapSize.width;
    const yScale = h / paintedMapSize.height;
    const segments=[];
    for(let i=1;i<targets.length;i++) {
      const waypoints = campusWalkways[i-1].map(([x,y])=>({x:x*xScale,y:y*yScale}));
      const points = [targets[i-1],...waypoints,targets[i]];
      let d=`M${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`;
      for(let k=0;k<points.length-1;k++) {
        const prev=points[Math.max(0,k-1)], a=points[k], b=points[k+1];
        const next=points[Math.min(points.length-1,k+2)];
        const t=.10;
        const c1={x:a.x+(b.x-prev.x)*t,y:a.y+(b.y-prev.y)*t};
        const c2={x:b.x-(next.x-a.x)*t,y:b.y-(next.y-a.y)*t};
        d+=` C${c1.x.toFixed(2)},${c1.y.toFixed(2)} ${c2.x.toFixed(2)},${c2.y.toFixed(2)} ${b.x.toFixed(2)},${b.y.toFixed(2)}`;
      }
      const seg=document.createElementNS('http://www.w3.org/2000/svg','path');
      seg.setAttribute('d',d);
      segments.push({path:seg,length:seg.getTotalLength()});
    }
    path.setAttribute('d','');
    return segments;
  }

  function printAt(segment, distance, side) {
    const p=segment.path.getPointAtLength(distance);
    const a=segment.path.getPointAtLength(Math.max(0,distance-1));
    const b=segment.path.getPointAtLength(Math.min(segment.length,distance+1));
    const angle=Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI+90;
    const ns='http://www.w3.org/2000/svg';
    const group=document.createElementNS(ns,'g');
    group.setAttribute('class','walking-print');
    group.setAttribute('transform',`translate(${p.x} ${p.y}) rotate(${angle}) translate(${side*7.2} 0) scale(.68)`);
    const fore=document.createElementNS(ns,'path');
    fore.setAttribute('d','M0,-16 C-5.5,-16.2 -8.4,-11.4 -7.9,-6.4 C-7.5,-2.3 -4.6,2.4 -2.3,4.1 Q0,5.2 2.3,4.1 C4.6,2.4 7.5,-2.3 7.9,-6.4 C8.4,-11.4 5.5,-16.2 0,-16 Z');
    fore.setAttribute('stroke','#f8efdf');
    fore.setAttribute('stroke-width','1.05');
    fore.setAttribute('stroke-linejoin','round');
    const heel=document.createElementNS(ns,'path');
    heel.setAttribute('d','M-4.1,8.2 Q0,6.9 4.1,8.2 L4.4,13.9 Q0,16.8 -4.4,13.9 Z');
    heel.setAttribute('stroke','#f8efdf');
    heel.setAttribute('stroke-width','1.05');
    heel.setAttribute('stroke-linejoin','round');
    group.append(fore,heel);
    prints.appendChild(group);
    if(prints.childElementCount>28)prints.firstElementChild.remove();
  }

  async function play() {
    const mine=++generation;
    const segments=route();
    prints.replaceChildren();
    stops.forEach(s=>s.classList.remove('visited','is-current'));
    const arrive = index => { stops.forEach((s, j) => s.classList.toggle('is-current', j === index)); stops[index].classList.add('visited'); };
    if(reduced.matches){ stops.forEach(s=>s.classList.add('visited')); return; }
    if(!active)return;
    arrive(0);
    // Light up the starting milestone immediately and hold for 1.5 seconds.
    await sleep(1500);
    let side=0;
    for(let i=0;i<segments.length;i++){
      const seg=segments[i];
      const destination=stops[i+1].querySelector('.education-note');
      let arrived=false;
      // Match the original natural walking cadence. Do not shorten the CCC→NAU leg.
      // Detect ACTUAL visual contact with the destination card, rather than waiting
      // for a possibly long or looping waypoint path to reach its hidden marker.
      for(let d=0;d<seg.length;d+=20){
        if(mine!==generation||!active)return;
        const distance=Math.min(seg.length,d);
        const pt=seg.path.getPointAtLength(distance);
        printAt(seg,distance,side++%2===0?-1:1);
        const card=destination.getBoundingClientRect();
        const bounds=map.getBoundingClientRect();
        const x=pt.x+bounds.left, y=pt.y+bounds.top;
        // Ink shoeprint extends ~12 CSS px beyond its path point.
        if(x>=card.left-13 && x<=card.right+13 && y>=card.top-13 && y<=card.bottom+13){
          arrive(i+1); arrived=true; break;
        }
        await sleep(135);
      }
      if(mine!==generation||!active)return;
      if(!arrived){
        printAt(seg,seg.length,side++%2===0?-1:1);
        arrive(i+1);
      }
      // Hold exactly 1.5 seconds after contact, not before the highlight.
      await sleep(1500);
    }
    if(mine===generation&&active){ await sleep(1000); if(mine===generation&&active)play(); }
  }
  function restart(){generation++;clearTimeout(timeoutId);if(active||reduced.matches)play();else route();}
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      const visible=entries[0].isIntersecting;
      if(visible===active)return;
      active=visible;restart();
    },{threshold:.05}); observer.observe(map);
  } else { active=true; play(); }
  let resizeId;
  window.addEventListener('resize',()=>{clearTimeout(resizeId);resizeId=setTimeout(restart,220)});
  reduced.addEventListener?.('change',restart);
  route();
})();;

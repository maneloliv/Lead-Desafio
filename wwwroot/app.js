
const API_URL = 'http://localhost:5000/api/leads';

let leadsCache = [];

// inicialização
document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  loadLeads();
  const floatingBtn = document.getElementById('floatingBtn');
  const popupOverlay = document.getElementById('popupOverlay');
  const closeBtn = document.getElementById('closeBtn');
  const contactForm = document.getElementById('contactForm');


  floatingBtn.addEventListener('click', function() {
      popupOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; 
  });


  closeBtn.addEventListener('click', function() {
      popupOverlay.classList.remove('active');
      document.body.style.overflow = 'auto'; 
  });


  popupOverlay.addEventListener('click', function(e) {
      if (e.target === popupOverlay) {
          popupOverlay.classList.remove('active');
          document.body.style.overflow = 'auto';
      }
  });


  document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
          popupOverlay.classList.remove('active');
          document.body.style.overflow = 'auto';
      }
  });


  contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Formulário enviado com sucesso!');
      popupOverlay.classList.remove('active');
      document.body.style.overflow = 'auto';
      contactForm.reset();
  });
});

// carregar leads do backend
async function loadLeads() {
  showLoading(true);
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Erro ao carregar leads');
    const data = await res.json();
    // garantir array
    leadsCache = Array.isArray(data) ? data : [];
    // renderizar aba ativa
    const activeTab = document.querySelector('.tab.active')?.dataset.tab || 'accepted';
    renderList(activeTab);
  } catch (err) {
    console.error('Erro:', err);
    alert('Erro ao carregar leads: ' + err.message);
    leadsCache = [];
    renderList('accepted');
  } finally {
    showLoading(false);
  }
}
document.addEventListener('DOMContentLoaded', function() {
    loadLeads();
    
    // configurar o formulario
    document.getElementById('leadForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addLead();
    });
});
async function addLead() {
    const lead = {
        contactFirstName: document.getElementById('contactFirstName').value,
        contactLastName: document.getElementById('contactLastName').value,
        email: document.getElementById('email').value,
        suburb: document.getElementById('suburb').value,
        category: document.getElementById('category').value,
        phone: formatPhoneNumber(document.getElementById('Phone').value),
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value) || 0
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(lead)
        });

        if (!response.ok) throw new Error('Erro ao adicionar lead');
        
        // iimpar formulario e recarregar lista
        document.getElementById('leadForm').reset();
        loadLeads();
        alert('Lead adicionado com sucesso! ✅');
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao adicionar lead: ' + error.message);
    }
}

// configura evento das tabs
function setupTabs() {
  const tabs = Array.from(document.querySelectorAll('.tab'));
  tabs.forEach(t => {
    t.addEventListener('click', () => {
      tabs.forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      tabs.forEach(x => x.setAttribute('aria-selected', x === t ? 'true' : 'false'));
      renderList(t.dataset.tab);
    });
  });
}

// renderiza lista filtrando por tab
function renderList(which) {
  const listEl = document.getElementById('list');
  const emptyEl = document.getElementById('emptyMessage');
  const countEl = document.getElementById('showCount');

  let items = leadsCache.map(normalizeLead);

  // filtro: invited = status === 'New' ; accepted = status !== 'New'
  if (which === 'invited') {
    items = items.filter(l => String(l.status).toLowerCase() === 'new');
    listEl.innerHTML = items.map(cardHtml).join('');
  } else {
    items = items.filter(l => String(l.status).toLowerCase() === 'accepted');
    listEl.innerHTML = items.map(cardHtmldeclined).join('');
  }

  countEl.textContent = items.length;

  if (items.length === 0) {
    listEl.innerHTML = '';
    emptyEl.style.display = 'block';
    return;
  }
  emptyEl.style.display = 'none';

  
}

// normaliza/segurança dos campos do lead vindo do backend
function normalizeLead(l) {
  return {
    id: l.id ?? l.leadId ?? 0,
    contactFirstName: l.contactFirstName ?? l.firstName ?? l.name ?? '',
    contactLastName: l.contactLastName ?? l.lastName ?? '',
    email: l.email ?? '',
    suburb: l.suburb ?? l.location ?? '',
    category: l.category ?? '',
    phone: l.phone ?? '',
    description: l.description ?? l.desc ?? '',
    price: (typeof l.price === 'number') ? l.price : parseFloat(l.price) || 0,
    status: l.status ?? '',
    dateCreated: l.dateCreated ?? l.createdAt ?? l.date ?? new Date().toISOString()
  };
}

function escHtml(s) {
  return String(s || '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

function icon(svg) {
  return '<span class="muted-icon" aria-hidden="true">' + svg + '</span>';
}

function cardHtml(it) {
  const name = (it.contactFirstName + ' ' + it.contactLastName).trim() || '—';
  const initial = escHtml((it.contactFirstName || it.contactLastName || ' ')[0] || '·');
  const dateStr = new Date(it.dateCreated).toLocaleString('pt-BR', {dateStyle: 'medium', timeStyle: 'short'});
  const priceText = '$ ' + (it.price || 0).toFixed(2);
  
 

  return `
  <article class="card" role="article" aria-label="Lead ${escHtml(name)}">
    <div class="row">
      <div class="avatar" aria-hidden="true">${initial}</div>
      <div class="meta">
        <div class="meta-top">
          <div>
            <div class="name">${escHtml(it.contactFirstName)}</div>
            <div class="sub">${escHtml(dateStr)}</div>
          </div>
        </div>

        <div class="info" aria-label="Detalhes do trabalho">
          <div class="item">${icon(locationIcon)} ${escHtml(it.suburb || '—')}</div>
          <div class="item">${icon(jobIcon)} ${escHtml(it.category || '—')}</div>
          <div class="item">Job ID: ${escHtml(String(it.id))}</div>
        </div>
        <div class="contact" aria-label="Contato">
          <div style="display:flex;gap:12px;align-items:center;">
            <div class="desc">${escHtml(it.description || '—')}</div>
           
          </div>
        </div>

        <div class="contact info" aria-label="Ações">
          <div style="display:flex;gap:12px;align-items:center;">
          <div class="item"><button class="accept-btn" onclick="acceptLead(${it.id})">Accept</button></div>
          <div class="item"><button class="delete-btn" onclick="declineLead(${it.id})">Decline</button></div>
          <div class="item"><strong>${escHtml(priceText)}</strong> Lead Invitation</div>
        </div>
      </div>
    </div>
  </article>`;
}
function cardHtmldeclined(it) {
  const name = (it.contactFirstName + ' ' + it.contactLastName).trim() || '—';
  const initial = escHtml((it.contactFirstName || it.contactLastName || ' ')[0] || '·');
  const dateStr = new Date(it.dateCreated).toLocaleString('pt-BR', {dateStyle: 'medium', timeStyle: 'short'});
  const priceText = '$ ' + (it.price || 0).toFixed(2);
  const phone = it.phone;
 

  return `
  <article class="card" role="article" aria-label="Lead ${escHtml(name)}">
    <div class="row">
      <div class="avatar" aria-hidden="true">${initial}</div>
      <div class="meta">
        <div class="meta-top">
          <div>
            <div class="name">${escHtml(name)}</div>
            <div class="sub">${escHtml(dateStr)}</div>
          </div>
        </div>

        <div class="info" aria-label="Detalhes do trabalho">
          <div class="item">${icon(locationIcon)} ${escHtml(it.suburb || '—')}</div>
          <div class="item">${icon(jobIcon)} ${escHtml(it.category || '—')}</div>
          <div class="item">Job ID: ${escHtml(String(it.id))}</div>
          <div class="item"><strong>${escHtml(priceText)}</strong> Lead Invitation</div>
        </div>
        <div class="contact" aria-label="Contato">
          <div style="display:flex;gap:12px;align-items:center;">
              <div class="desc">${icon(PhoneIcon)} ${phone}</div>
              <div class="desc">${icon(latterIcon)} ${escHtml(it.email || '—')}</div>
          </div>
        </div>

        <div class="contact info" aria-label="Ações">
          <div style="display:flex;gap:12px;align-items:center;">
          <div class="desc">${escHtml(it.description || '—')}</div>
        </div>
      </div>
    </div>
  </article>`;
}
function showLoading(show) {
  document.getElementById('loading').style.display = show ? 'block' : 'none';
}
function generateLeadTXT(lead) {
    const timestamp = new Date();
    
    const content = `LEAD INFORMATION
      ================
      Cliente: ${lead.contactFirstName} ${lead.contactLastName}
      Email: ${lead.email}
      Telefone: ${lead.phone || 'N/A'}
      Localização: ${lead.suburb}
      Serviço: ${lead.category}
      Descrição: ${lead.description}
      Orçamento: $${lead.price}
      Status: ${lead.status}
      Data Aceitação: ${timestamp.toLocaleString()}
      ID: ${lead.id}
      ================`;

    // criar e baixar arquivo
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = `lead_${lead.contactFirstName}_${lead.contactLastName}.txt`;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}
async function acceptLead(id) {
    if (!confirm('Aceitar este lead e gerar arquivo TXT?')) return;
    
    const lead = leadsCache.map(normalizeLead).find(l => Number(l.id) === Number(id));
    if (!lead) { 
        alert('Lead não encontrado'); 
        return; 
    }

    let newPrice = lead.price || 0;
    if (newPrice > 500) {
        newPrice = +(newPrice * 0.9).toFixed(2);
    }

    showLoading(true);
    try {
        const payload = { 
            ...lead,
            status: 'Accepted', 
            price: newPrice 
        };

        let res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (!res.ok) throw new Error('Erro ao atualizar lead');
        
        // gerar e baixar arquivo TXT
        generateLeadTXT({...lead, price: newPrice, status: 'Accepted'});
        
        await loadLeads();
        
    } catch (err) {
        console.error('Erro:', err);
        alert('Erro ao aceitar lead: ' + err.message);
    } finally {
        showLoading(false);
    }
}

function formatPhoneNumber(phone) {
    // remove tudo que não é numero
    const cleaned = phone.replace(/\D/g, '');
    
    // cerifica se tem o tamanho minimo
    if (cleaned.length < 10 || cleaned.length > 11) {
        return phone;
    }
    // formata baseado no tamanho
    if (cleaned.length === 10) {
        // Formato: (11) 1111-1111
        return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 11) {
        // Formato: (11) 11111-1111
        return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return phone;
}

async function declineLead(id) {
  if (!confirm('Recusar este lead?')) return;
  const lead = leadsCache.map(normalizeLead).find(l => Number(l.id) === Number(id));
  if (!lead) { 
    alert('Lead não encontrado'); 
    return; 
  }

  showLoading(true);
  try {
    let res;
    let methodUsed = '';
    
    const payload = { 
      ...lead,
      status: 'Declined'
    };
    res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    methodUsed = 'PUT';
    if (res.status === 405) {
      res = await fetch(`${API_URL}/${id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-HTTP-Method-Override': 'PUT'
        },
        body: JSON.stringify(payload)
      });
      methodUsed = 'POST';
    }
    if (!res.ok) {
      throw new Error(`Método ${methodUsed} falhou: ${res.status}`);
    }
    await loadLeads();
    alert('Lead recusado com sucesso!');
    
  } catch (err) {
    console.error('Erro:', err);
    alert('Erro ao recusar lead: ' + err.message);
  } finally {
    showLoading(false);
  }
}

const locationIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
`;
const jobIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
</svg>
`;
const latterIcon =`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
</svg>
`;
const PhoneIcon =`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
</svg>
`;





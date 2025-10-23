document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("registerModal")
  const step1 = document.getElementById("registerStep1")
  const step2 = document.getElementById("registerStep2")

  // Remplir jours/années
  const daySelect = document.getElementById("daySelect")
  const yearSelect = document.getElementById("yearSelect")
  for(let i=1;i<=31;i++) daySelect.innerHTML+=`<option value="${i}">${i}</option>`
  const currentYear = new Date().getFullYear()
  for(let i=currentYear;i>=1900;i--) yearSelect.innerHTML+=`<option value="${i}">${i}</option>`

  // Boutons
  document.getElementById("closeRegister")?.addEventListener("click", ()=>{ step1.classList.remove("hidden"); step2.classList.add("hidden"); modal.classList.add("hidden")})
  document.getElementById("nextRegisterStep")?.addEventListener("click", ()=>{ step1.classList.add("hidden"); step2.classList.remove("hidden") })

  document.getElementById("submitRegister")?.addEventListener("click", async ()=>{
    const data = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      birthdate: `${document.getElementById("yearSelect").value}-${String(document.getElementById("monthSelect").value).padStart(2,'0')}-${String(document.getElementById("daySelect").value).padStart(2,'0')}`,
      password: document.getElementById("createPassword").value
    }
    try{
      const res = await fetch("/api/register",{ method:"POST", headers:{'Content-Type':'application/json','Accept':'application/json'}, body: JSON.stringify(data)})
      const result = await res.json()
      if(res.ok){ alert(result.message||"Compte créé"); step1.classList.remove("hidden"); step2.classList.add("hidden"); modal.classList.add("hidden") }
      else alert("Erreur: "+(result.message||JSON.stringify(result.errors)))
    }catch(err){ console.error(err); alert("Une erreur est survenue.") }

  })

  document.getElementById("gotoLoginFromRegister")?.addEventListener("click", ()=>{
    modal.classList.add("hidden")
    const loginModal = document.getElementById("loginModal")
    if(loginModal) loginModal.classList.remove("hidden")
  })
})

document.addEventListener("DOMContentLoaded", ()=>{
  const modal = document.getElementById("loginModal")
  const step1 = document.getElementById("loginStep1")
  const step2 = document.getElementById("loginStep2")

  document.getElementById("closeLogin")?.addEventListener("click", ()=>{ step1.classList.remove("hidden"); step2.classList.add("hidden"); modal.classList.add("hidden") })
  document.getElementById("nextLoginStep")?.addEventListener("click", ()=>{ step1.classList.add("hidden"); step2.classList.remove("hidden") })

  document.getElementById("submitLogin")?.addEventListener("click", async ()=>{
    const data = { email: document.getElementById("loginEmail").value, password: document.getElementById("loginPassword").value }
    try{
      const res = await fetch("/api/login",{ method:"POST", headers:{'Content-Type':'application/json','Accept':'application/json'}, body: JSON.stringify(data)})
      const result = await res.json()
      if(res.ok){ alert(result.message||"Connecté"); step1.classList.remove("hidden"); step2.classList.add("hidden"); modal.classList.add("hidden") }
      else alert("Erreur: "+(result.message||JSON.stringify(result.errors)))
    }catch(err){ console.error(err); alert("Une erreur est survenue.") }
  })

  document.getElementById("gotoRegisterFromLogin")?.addEventListener("click", ()=>{
    modal.classList.add("hidden")
    const regModal = document.getElementById("registerModal")
    if(regModal) regModal.classList.remove("hidden")
  })
})

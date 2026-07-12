(function () {
  'use strict'

  const config = window.AEROBRIDGE || {}
  const menuButton = document.querySelector('[data-menu-button]')
  const navigation = document.querySelector('[data-site-nav]')

  function setMenu(open) {
    if (!menuButton || !navigation) return
    navigation.dataset.open = String(open)
    menuButton.setAttribute('aria-expanded', String(open))
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation')
    document.body.classList.toggle('menu-open', open)
  }

  if (menuButton && navigation) {
    menuButton.addEventListener('click', function () {
      setMenu(navigation.dataset.open !== 'true')
    })

    navigation.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false)
    })

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setMenu(false)
    })

    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) setMenu(false)
    })
  }

  document.addEventListener('click', function (event) {
    const whatsappLink = event.target.closest('a[href*="wa.me"]')
    if (whatsappLink && typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        send_to: 'AW-18028243819/whatsapp_click',
        value: 0.5,
        currency: 'CLP'
      })
    }
  })

  const consultationForm = document.querySelector('[data-consultation-form]')
  if (!consultationForm) return

  const formStatus = consultationForm.querySelector('[data-form-status]')

  consultationForm.addEventListener('submit', function (event) {
    event.preventDefault()

    if (!consultationForm.reportValidity()) return

    const data = new FormData(consultationForm)
    const lines = [
      'Hello Aerobridge, I would like to request a 15-minute consultation.',
      '',
      'Name: ' + data.get('name'),
      'Email: ' + data.get('email'),
      'Country: ' + data.get('country'),
      'Interest: ' + data.get('interest'),
      'Current goal: ' + data.get('goal')
    ]

    const note = String(data.get('message') || '').trim()
    if (note) lines.push('Note: ' + note)

    const phone = String(config.whatsappNumber || '').replace(/\D/g, '')
    const url = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(lines.join('\n'))

    if (formStatus) {
      formStatus.textContent = 'Opening WhatsApp with your request. You can review the message before sending it.'
    }

    const opened = window.open(url, '_blank', 'noopener,noreferrer')
    if (!opened) window.location.assign(url)
  })
})()

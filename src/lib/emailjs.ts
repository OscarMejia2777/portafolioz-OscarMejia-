import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || ''
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''

interface ContactForm {
  name: string
  email: string
  message: string
}

export async function sendContactEmail(data: ContactForm): Promise<boolean> {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn('EmailJS not configured')
    return false
  }

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, data, PUBLIC_KEY)
    return true
  } catch (error) {
    console.error('EmailJS error:', error)
    return false
  }
}

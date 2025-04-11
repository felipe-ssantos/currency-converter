export const fetchExchangeRates = async (base = 'USD') => {
  
  const apiKey = import.meta.env.VITE_EXCHANGE_RATE_API_KEY
  const apiBaseUrl = import.meta.env.VITE_EXCHANGE_RATE_API_BASE_URL

  if (!apiKey || !apiBaseUrl) {
    throw new Error(
      'A configuração da API está faltando - verifique suas variáveis ​​de ambiente'
    )
  }

  const url = `${apiBaseUrl}/${apiKey}/latest/${base}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (data.result === 'success') {
      return {
        base: data.base_code,
        rates: data.conversion_rates,
        lastUpdated: data.time_last_update_utc
      }
    } else {
      console.error('Formato inesperado de resposta da API:', data)
      throw new Error(data['error-type'] || 'Formato inesperado de resposta da API')
    }
  } catch (error) {
    console.error('Erro ao buscar taxas de câmbio:', error)
    throw error
  }
}

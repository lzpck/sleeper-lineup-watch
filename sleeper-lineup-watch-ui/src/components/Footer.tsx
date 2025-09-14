import React from 'react'

const Footer: React.FC = () => {
  // Função para copiar a chave PIX para o clipboard
  const copyPixToClipboard = async () => {
    const pixKey = 'leandro.mdrs@icloud.com'
    
    try {
      await navigator.clipboard.writeText(pixKey)
      // Feedback visual simples - pode ser expandido com toast/notification
      alert('Chave PIX copiada para a área de transferência!')
    } catch (err) {
      console.error('Erro ao copiar PIX:', err)
      // Fallback para navegadores mais antigos
      const textArea = document.createElement('textarea')
      textArea.value = pixKey
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Chave PIX copiada para a área de transferência!')
    }
  }

  return (
    <footer>
      <div className="footer-content">
        <div className="credits">
          Desenvolvido por Leandro Zepechouka
        </div>
        
        <div className="pix-box">
          <span>PIX: leandro.mdrs@icloud.com</span>
          <button 
            className="pix-button" 
            onClick={copyPixToClipboard}
            title="Copiar chave PIX"
          >
            Copiar PIX
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
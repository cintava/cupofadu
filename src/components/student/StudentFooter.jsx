export default function StudentFooter({ onCalendarioClick, onChatClick, onAulaClick }) {
  return (
    <div className="student-footer">
      <button className="footer-btn" title="Calendario" onClick={onCalendarioClick}>
        <span className="footer-icon">📅</span>
        <span>Calendario</span>
      </button>
      <button className="footer-btn" title="Chat" onClick={onChatClick}>
        <span className="footer-icon">💬</span>
        <span>Chat</span>
      </button>
      <button className="footer-btn" title="Encontrá Aula" onClick={onAulaClick}>
        <span className="footer-icon">🔍</span>
        <span>Encontrá Aula</span>
      </button>
      <button className="footer-btn" title="Mi Perfil">
        <span className="footer-icon">⚙️</span>
        <span>Mi Perfil</span>
      </button>
    </div>
  )
}

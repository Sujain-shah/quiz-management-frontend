export default function Alert({ message, type = "error" }) {
  if (!message) return null;
  return <div className={`alert ${type}`}>{message}</div>;
}
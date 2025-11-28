export const exportChatToText = (messages, groupName) => {
  let content = `Chat History - ${groupName}\n`;
  content += `Exported on: ${new Date().toLocaleString()}\n`;
  content += '='.repeat(50) + '\n\n';

  messages.forEach(msg => {
    const timestamp = new Date(msg.createdAt).toLocaleString();
    content += `[${timestamp}] ${msg.sender.username}:\n`;
    content += `${msg.content}\n\n`;
  });

  // Create and download file
  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${groupName.replace(/\s+/g, '_')}_chat_${Date.now()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const exportChatToJSON = (messages, groupName) => {
  const data = {
    groupName,
    exportedAt: new Date().toISOString(),
    messageCount: messages.length,
    messages: messages.map(msg => ({
      timestamp: msg.createdAt,
      sender: msg.sender.username,
      content: msg.content,
      type: msg.messageType
    }))
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${groupName.replace(/\s+/g, '_')}_chat_${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
const form = document.querySelector('form');
form.addEventListener('submit', e => {
  e.preventDefault(); // impede que a página seja recarregada
  
  // obtém os valores dos campos do formulário
  const name = form.elements.name.value;
  const email = form.elements.email.value;
  const category = form.elements.category.value;
  const message = form.elements.message.value;
  
  // exibe os valores no console
  console.log(`Nome: ${name}`);
  console.log(`E-mail: ${email}`);
  console.log(`Categoria: ${category}`);
  console.log(`Mensagem: ${message}`);
  
  // aqui você pode enviar os valores para o servidor, por exemplo, usando AJAX ou fetch
});

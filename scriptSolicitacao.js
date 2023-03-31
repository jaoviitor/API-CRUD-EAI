// aqui é um exemplo de array com as solicitações
const requests = [
    {
      name: 'Fulano',
      email: 'fulano@example.com',
      category: 'suporte',
      description: 'Preciso de ajuda com o computador'
    },
    {
      name: 'Ciclano',
      email: 'ciclano@example.com',
      category: 'financeiro',
      description: 'O software não está respondendo'
    },
    {
      name: 'Beltrano',
      email: 'beltrano@example.com',
      category: 'vendas',
      description: 'Preciso de auxilio para cadastrar um cliente'
    }
  ];
  
  const tbody = document.getElementById('table-body');
  
  requests.forEach(request => {
    const tr = document.createElement('tr');
    
    const nameTd = document.createElement('td');
    nameTd.textContent = request.name;
    tr.appendChild(nameTd);
    
    const emailTd = document.createElement('td');
    emailTd.textContent = request.email;
    tr.appendChild(emailTd);
    
    const categoryTd = document.createElement('td');
    categoryTd.textContent = request.category;
    tr.appendChild(categoryTd);
    
    const descriptionTd = document.createElement('td');
    descriptionTd.textContent = request.description;
    tr.appendChild(descriptionTd);
    
    tbody.appendChild(tr);
  });
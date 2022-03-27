const qS = (el)=>document.querySelector(el);
const qSa = (el)=>document.querySelectorAll(el);
let val = {
    handleSubmit: async(event)=>{
        event.preventDefault();
        let send = true;
        let inputs = form.querySelectorAll('input');
        val.clearErrors();
        for (let i = 0; i < inputs.length; i++) {
            let input = inputs[i];
            let check = val.checkInput(input);
            if(check !== true){
                send = false;
                val.showError(input, check);
            }
        }
        if(send){
            form.click();
            let register = val.register()
            if(register){
                val.login()
            }
        }
    },
    checkInput:(input)=>{
        let rules = input.getAttribute('data-rules');
        if(rules !== null){
            rules = rules.split('|');
            for(let k in rules){
                let rDetails = rules[k].split('=');
                switch(rDetails[0]) {
                    case 'required':
                        if(input.value == ''){
                            return 'Campo não pode ser vazio.'
                        }
                        break;

                    case 'email':
                        if(input.value != ''){
                            let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                            if(!regex.test(input.value.toLowerCase())){
                                return 'E-mail digitado não é valido!';
                            }
                        }
                    break;

                    case 'min':
                        if(input.value.length < rDetails[1]){
                            return `Campo tem que ter pelo menos ${rDetails[1]} caractes`
                        }
                    break;
                }
            }

        }
        return true;
    },
    showError:(input, error)=>{
        input.style.borderColor = '#8B0000';
        let errorElement = document.createElement('div');
        errorElement.classList.add('error');
        errorElement.innerHTML = error;
        input.parentElement.insertBefore(errorElement, input.nextElementSibling);
    },
    clearErrors:()=>{
        let inputs = form.querySelectorAll('input');
        for(let i = 0; i < inputs.length; i++){
            inputs[i].style = '';
        }

        let errorElements = qSa('.error')
        for(let i=0; i < errorElements.length; i++) {
            errorElements[i].remove();
        }
    },
    register: async () => {
        let identifier = form.getAttribute('identifier');
        if(identifier == 'register'){
            let email = qS('#email').value
            let password = qS('#senha').value
            const requestInfo = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    email: email,
                    password: password
                })
            };
        
            let request = await fetch("http://localhost/register", requestInfo)
            let json = await request.json()
    
            window.alert('Registro feito com sucesso!')
            window.location.href = 'login.html'
            if(json.status == true) {
                return true
            }
        }

    },
    login: async () => {
        let identifier = form.getAttribute('identifier');
        if(identifier == 'login'){
            let email = qS('#email--login').value
            let password = qS('#senha--login').value
            const requestInfo = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    email: email,
                    password: password
                })
            };
        
            let request = await fetch("http://localhost/login", requestInfo)
            let json = await request.json()
            
            localStorage.setItem('auth:token', json.token)

            if(json.status === true){
                const requestInfo = {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("auth:token")}`,
                    }
                };
        
                let request = await fetch("http://localhost/list", requestInfo)
                let json = await request.json()
                window.alert('Login feito com sucesso!')
                val.modalList(json)
            }else {
                window.alert('Email ou senha incorretos!')
                console.log(json)
            }
            
        }
    },
    modalList: (json) => {
        qS('.screen').style.justifyContent = 'center';
        qS('.screen').style.alignItems = 'center';
        qS('.rightside').style.display = 'none';
        qS('.modal').style.display = 'block';

        const listElement = qS('#list')
        json.list.forEach((item, index)=>{
            const element = document.createElement('li');
            element.classList.add('result')
            element.innerText = item
            listElement.appendChild(element)
        });
    }
};
let form = qS('.validator')
let submitRegister = qS('#submit--register')
let submitLogin = qS('#submit--login')
if(submitRegister){
    submitRegister.addEventListener('click', val.handleSubmit);
}
if(submitLogin){
    submitLogin.addEventListener('click', val.handleSubmit)
}


qS('.rightside').addEventListener('mouseover', ()=>{
    qS('.rightside').style.backgroundColor = '#18293bcc';
});
qS('.rightside').addEventListener('mouseout', ()=>{
    qS('.rightside').style.backgroundColor = '#18293b5d';
});

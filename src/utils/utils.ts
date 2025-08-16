import nodemailer from "nodemailer"

export function validaSenha(senha: string) {

  const mensa: string[] = []

  // .length: retorna o tamanho da string (da senha)
  if (senha.length < 8) {
    mensa.push("Erro... senha deve possuir, no mínimo, 8 caracteres")
  }

  // contadores
  let pequenas = 0
  let grandes = 0
  let numeros = 0
  let simbolos = 0

  // senha = "abc123"
  // letra = "a"

  // percorre as letras da variável senha
  for (const letra of senha) {
    // expressão regular
    if ((/[a-z]/).test(letra)) {
      pequenas++
    }
    else if ((/[A-Z]/).test(letra)) {
      grandes++
    }
    else if ((/[0-9]/).test(letra)) {
      numeros++
    } else {
      simbolos++
    }
  }

  if (pequenas == 0 || grandes == 0 || numeros == 0 || simbolos == 0) {
    mensa.push("Erro... senha deve possuir letras minúsculas, maiúsculas, números e símbolos")
  }

  return mensa
}
export async function enviaEmail(
    email:string, 
    texto: string,
    Re: string,
    Html: string

){

    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: "06e36772288d21",
          pass: "1ddcedc01b223d",
        },
      });
  
      const info = await transporter.sendMail({
        from: 'rastreador@Guardian.com', // sender address
        to: email, // list of receivers
        subject: Re, // Subject line
        text: texto, // plain text body
        html: Html
        // html: "<h3>Esyimado Cliente " + nome +" </h3>"
      });
    
      console.log("Message sent: %s", info.messageId);
  
  }
  export function gerarString(tamanho: number): string{
    const caracteres ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let resultado = ""
    for (let i = 0 ; i < tamanho; i++){
      resultado = resultado + caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return resultado
  }
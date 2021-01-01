const parseDate = (date) => {
    try {
        dateArr = date.split('-')
        if(dateArr.length > 1){
            return dateArr[2] + '-' + dateArr[1] + '-' + dateArr[0]
        }
    } catch (error) {
        return null
    }
}

const parseCEP = (cep) => {
    try {
        return cep.substr(0, 5) + '-' + cep.substr(5)
    } catch (error) {
        return null
    }
}

const parseCNPJ = (cnpj) => {
    try {
        return cnpj.substr(0,2) + '.' + cnpj.substr(2,3) + '.' + cnpj.substr(5,3) + '/' + cnpj.substr(8,4) + '-' + cnpj.substr(12,2)
    } catch (error) {
        return null
    }
}

const parseCPF = (cpf) => {
    try {
        return cpf.substr(0, 3) + '.' + cpf.substr(3,3) + '.' + cpf.substr(6,3) + '-' + cpf.substr(9, 2)
    } catch (error) {
        return null
    }
}

export default { parseDate, parseCEP, parseCNPJ, parseCPF }
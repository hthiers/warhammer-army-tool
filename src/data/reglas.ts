type DescFn = (valor: string) => string
type Desc = string | DescFn

export const REGLAS_ESPECIALES: Record<string, Desc> = {
  'Fuego Rápido': (x) =>
    `Cuando dispara a la mitad del rango máximo, obtiene ${x} Ataque${Number(x) > 1 ? 's' : ''} adicional${Number(x) > 1 ? 'es' : ''}.`,
  'Antiinfantería': (x) =>
    `Las tiradas de herida de ${x} o más contra unidades de Infantería hieren automáticamente.`,
  'Antivehículo': (x) =>
    `Las tiradas de herida de ${x} o más contra unidades de Vehículo hieren automáticamente.`,
  'Anti': (x) =>
    `Las tiradas de herida de ${x.split(' ').pop()} o más contra el tipo indicado hieren automáticamente.`,
  'Heridas Devastadoras':
    'Las tiradas de herida no modificadas de 6 causan un número de heridas mortales igual al Daño del arma en lugar de infligir daño normal.',
  'Pistola':
    'Puede disparar en la fase de Disparo incluso si la unidad está trabada en combate. Solo puede apuntar a unidades enemigas trabadas con la unidad del portador.',
  'Asalto':
    'Puede disparar incluso si la unidad ha Avanzado en la misma fase de Movimiento, sin penalización a la tirada de impactar.',
  'Pesada':
    'Si el portador no se ha movido en la fase de Movimiento de este turno, añade 1 a las tiradas de impactar al disparar con esta arma.',
  'Peligroso':
    'Tras disparar, por cada resultado de 1 no modificado para impactar, el portador sufre 1 herida mortal.',
  'Precisión':
    'Las tiradas de impactar no modificadas de 6 hieren automáticamente al objetivo y pueden asignarse a cualquier modelo de la unidad objetivo.',
  'Acoplada':
    'Cada vez que el portador ataca con esta arma, no puede realizar ataques con ninguna otra arma ese turno excepto otras armas con la regla Acoplada.',
  'Gauss':
    'Cada tirada de herida no modificada de 6 con esta arma causa 1 herida mortal adicional al objetivo además del daño normal.',
  'Fusión': (x) =>
    `Si el objetivo está a la mitad del alcance o menos, añade ${x} a la característica Daño de ese ataque.`,
  'Impactos Letales':
    'Las tiradas de impactar no modificadas de 6 hieren automáticamente al objetivo, sin necesidad de realizar tirada de herida.',
  'De Riesgo':
    'Tras disparar, por cada resultado de 1 no modificado para impactar, el portador sufre 1 herida mortal.',
  'Ignora Cobertura':
    'El objetivo no puede beneficiarse de ningún bono de salvación por cobertura contra ataques realizados con esta arma.',
  'Ráfaga':
    'Los ataques realizados con esta arma impactan automáticamente. No se realizan tiradas de impactar.',
  'Área':
    'Cuando el objetivo tiene 6 o más modelos, realiza siempre el número máximo de ataques posible con esta arma.',
  'Explosión': (x) =>
    `Si la tirada de impactar es 6, este ataque no apunta a un único modelo sino a la unidad completa: tira ${x} dados de daño adicionales.`,
  'Tormenta': (x) =>
    `Realiza ${x} tiradas de impactar adicionales con esta arma.`,
  'Golpes Sostenidos': (x) =>
    `Cada tirada de impactar no modificada de 6 genera ${x} impacto${Number(x) > 1 ? 's' : ''} adicional${Number(x) > 1 ? 'es' : ''}.`,
}

export function buscarRegla(texto: string): { desc: string } | null {
  const textNorm = texto.trim()

  if (REGLAS_ESPECIALES[textNorm]) {
    const entrada = REGLAS_ESPECIALES[textNorm]
    return { desc: typeof entrada === 'function' ? entrada('') : entrada }
  }

  for (const clave of Object.keys(REGLAS_ESPECIALES)) {
    if (textNorm.toLowerCase().startsWith(clave.toLowerCase())) {
      const valor = textNorm.slice(clave.length).trim()
      const entrada = REGLAS_ESPECIALES[clave]
      return { desc: typeof entrada === 'function' ? entrada(valor) : entrada }
    }
  }

  return null
}

const bi = require('leemon')
const d224 = require('./')

const order = BigInt('15028799613985034465755506450771565229282832217860390155996483840017')

var id = 'hello'
const attributes = [1].map(a => bi.int2bigInt(a, 64, 0))

var _p2x=new Array(3) 
_p2x[0]="8733743139883721929746557669281786776630567016143461292221315656826"
_p2x[1]="8361394066264508648455507973062910774845860829356344049728407408780" 
_p2x[2]="10875262355316927425360895615220150789510813104233695541722171619177"
var _p2y= new Array(3)
_p2y[0]="10447339307901630518074865526175395285504103515763147836036408151730"
_p2y[1]="5624160785336662084843147096952829593564757784171941592985688526173"
_p2y[2]="3410094274429991793295974722413474163646214393604192093427842333867"

var p2x=d224.G2BigInt(_p2x)
var p2y=d224.G2BigInt(_p2y)

var p2 = new Array(2)
p2[0] = p2x
p2[1] = p2y

var Q_id = d224.G1_from_hash(id)
// var Q2 = d224.element_pow_wind_G1(Q_id, bi.int2bigInt(2,1,1))

// var p22 = d224.G2_pow(p2, bi.int2bigInt(2, 1, 1))

// var gt = d224.pairing(Q_id[0],Q_id[1],p2x,p2y)

// var gt0 = d224.GT_pow(gt, bi.int2bigInt(2,1,1))
// var gt1 = d224.pairing(Q2[0],Q2[1],p2x,p2y)
// var gt2 = d224.pairing(Q_id[0],Q_id[1],p22[0],p22[1])

// console.log(d224.GIsEqual(gt0[0], gt2[0]))
// console.log(d224.GIsEqual(gt0[1], gt2[1]))
// console.log(d224.GIsEqual(gt1[0], gt2[0]))
// console.log(d224.GIsEqual(gt1[1], gt2[1]))

var keys = keygen(1)
console.log('hi')
var sig = sign(attributes, keys.sk)

verify(attributes, sig, keys.pk)

function keygen (n) {
  const a = new Array(n + 2)

  for (let i = 0; i < a.length; i++) {
    a[i] = rand()
  }
  const A = a.map(k => d224.G2_pow(p2, k))

  const q = rand()
  const Q = d224.G2_pow(p2, q)

  const z = rand()
  const Z = d224.G2_pow(p2, z)

  var sk = new Array(n + 3)
  let i = 0
  for (; i < n + 2;) {
    sk[i] = a[i++]
  }
  sk[i] = z

  var pk = new Array(n + 4)

  i = 0
  pk[i++] = order
  pk[i++] = d224.pairing
  pk[i++] = Q

  for (; i < n + 3;) {
    pk[i++] = A[i - 4]
  }
  pk[n + 3] = Z

  return {
    sk,
    pk
  }
}

function sign (k, sk) {
  const kappa = rand()
  const K = d224.G1_from_hash('why')

  const S = sk.slice(0, sk.length - 1).map(a => d224.element_pow_wind_G1(K, a))
  console.log(S)

  const T1 = d224.curve_mul(K, d224.element_pow_wind_G1(S[0], kappa))

  const pi = S.slice(1).reduce((acc, a, i) => d224.curve_mul(acc, d224.element_pow_wind_G1(a, k[i])))
  const T2 = d224.curve_mul(T1, pi)

  const T = d224.element_pow_wind_G1(T2, sk[sk.length - 1])

  const sig = []
  sig.push(kappa)
  sig.push(K)

  for (i = 0; i < S.length; i++) {
    sig.push(S[i])
  }

  sig.push(T)

  return sig
}

function verify (attr, sig, pk) {
  const kappa = sig[0]
  const K = sig[1]
  const Q = pk[2]

  const S = sig[2]
  const s = sig.slice(3, sig.length - 2)
  console.log(1)
  const A = pk[3]
  const a = pk.slice(4, sig.length - 2)
  console.log(2)

  const Z = pk[pk.length - 1]
  const T = sig[sig.length - 1]
  console.log(3)

  const T1 = d224.curve_mul(K, d224.element_pow_wind_G1(S, kappa))
  const pi =  s.reduce((acc, a, i) => d224.curve_mul(acc, d224.element_pow_wind_G1(a, attr[i])))
  const C = d224.curve_mul(T1, pi)
  console.log(4)

  const R = rand()
  const r = attr.map(rand)
  console.log(5)

  // compute elements needed for pairing
  let sProduct = s.reduce((acc, a, i) => d224.curve_mul(acc, d224.element_pow_wind_G1(a, r[i])))
  sProduct = d224.curve_mul(sProduct, d224.element_pow_wind_G1(S, R))
  console.log(6)

  let aProduct = a.reduce((acc, b, i) => d224.G2_curve_mul(acc, d224.G2_pow(b, r[i])))
  aProduct = d224.G2_curve_mul(aProduct, d224.G2_pow(A, R))
  console.log(7)

  var p0 = d224.pairing(sProduct[0], sProduct[1], Q[0], Q[1])
  var p1 = d224.pairing(K[0], K[1], aProduct[0], aProduct[1])
  var p2 = d224.pairing(T[0], T[1], Q[0], Q[1])
  var p3 = d224.pairing(C[0], C[1], Z[0], Z[1])
  console.log(8)

  // console.log(p0)
  // console.log(p1)
  // console.log(p2)
  // console.log(p3)

  var p4 = d224.pairing(S.slice()[0], S.slice()[1], Q.slice()[0], Q.slice()[1])
  var p5 = d224.pairing(S.slice()[0], S.slice()[1], Q.slice()[0], Q.slice()[1])

  // console.log(p4)
  // console.log(p5)
  console.log(d224.GIsEqual(p0[0], p1[0]))
  console.log(d224.GIsEqual(p0[1], p1[1]))
  console.log(d224.GIsEqual(p2[0], p3[0]))
  console.log(d224.GIsEqual(p2[1], p3[1]))
  console.log(d224.GIsEqual(p4[0], p5[0]))
  console.log(d224.GIsEqual(p4[1], p5[1]))
}

function rand () {
  var ret
  do {
    ret = bi.randBigInt(223, 0)
  } while (ret > order)

  return ret
}

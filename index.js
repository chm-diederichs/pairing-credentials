const bigint = require('leemon')
const ibe_hash = require('sha512-wasm')
/*
 * ibejs - Identity Based Encryption Javascript library.  
 *
 * Copyright (C) <2013 airpim srl> Tiziano Tresanti <info@airpim.com>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/."
 */

//Identity Based Encryption(IBE)and decryption in javascript
//IBE is a form of public-key encryption where the public key is actually a common string.
//using Boneh-Franklin scheme
//by Daniel Cheng 
//Email:dongxucheng@gmail.com
//
//dependencies:
// 1.Big Integer Library v. 5.4
//  Leemon Baird
//  www.leemon.com
//
// 2. SHA512 http://www.happycode.info/
//  http://jssha.sourceforge.net/
//
//The encrpytion and decryption interface is:
//export function ibe_encrypt(id,msg)
//export function ibe_decrypt(secretKeyJson,msgJson)
//in ibe.js
//
//the secret key extraction export function is :
//export function extract_secret_key(id)
//in ibe_extract.js
//notice: keep this export function at your PKG server. don't let the client know it.
//
//

var _q="15028799613985034465755506450771565229282832217860390155996483840017"
ibe_q=bigint.str2bigInt(_q,10,0) 

module.exports.printArray = printArray = function ( a )
{
        if (a.length == 0)
        {
            document.write( "[]")
            document.write('<br>')
        }
        for ( var i=0; i< a.length; ++i)
        {
            document.write( bigint.bigInt2str(a[i],10,0))
            document.write('<br>')
        }
}
module.exports.printGTArray = printGTArray = function (a)
{
    printArray(a[0])
    printArray(a[1])
}

module.exports.gt2str = gt2str = function (a)
{
  var str="";
  if(a.length == 0 )
    str=[]
  else
    {
      str+="["  
      for(var i=0;i<a.length;i++)
      {
        str+="["
        for(var j=0;j<a[i].length;j++)
        {
          str+="'"+bigint.bigInt2str(a[i][j],10,0)+"'"
          str+=","
        }
        str+="],"
      }
      str+="]"
    }
  return str
}

module.exports.g12str = g12str = function (a)
{
  var str="";
  if(a.length == 0 )
    str=[]
  else
    {
      str+="["  
      for(var i=0;i<a.length;i++)
      {
          str+="'"+bigint.bigInt2str(a[i],10,0)+"'"
          str+=","
      }
      str+="]"
    }
  return str
}

module.exports.printElem = printElem = function (anum)
{

            document.write( bigint.bigInt2str(anum,10,0))
            document.write('<br>')
}

module.exports.printMark = printMark = function (str)
{
   
        document.write( str )
        document.write('<br>')
}

module.exports.ascStr2BigInt = ascStr2BigInt = function (str)
{
    var i;
    m=""
    for(i=0;i<str.length;i++)
    {
        m += str.charCodeAt(i).toString(16)
    }
    return bigint.str2bigInt(m,16)
    
}

module.exports.G2BigInt = G2BigInt = function (g)
{
    var gb=new Array(g.length)
    for(var i=0; i<g.length; ++i)
    {
        gb[i] = bigint.str2bigInt(g[i],10,0)
            
            //document.write( bigint.bigInt2str(gb[i],10,0))
            //document.write('<br>')
            //  
    }
    return gb
}

module.exports.GDup = GDup = function (g)
{
    var gb=new Array(g.length)
    for(var i=0; i<g.length; ++i)
    {
        gb[i] = bigint.dup(g[i])
    }
    return gb
}
module.exports.GMul = GMul = function (v,e)
{
    var ret = new Array(v.length)
    for(var i=0;i<v.length;++i)
    {
        ret[i]=fp_mult(v[i],e[i])
    }
    return ret

}

module.exports.GAdd = GAdd = function (v,e)
{
    var ret = new Array(v.length)
    for(var i=0;i<v.length;++i)
    {
        ret[i]=fp_add(v[i],e[i])
    }
    return ret

}
module.exports.GSub = GSub = function (v,e)
{
    var ret = new Array(v.length)
    for(var i=0;i<v.length;++i)
    {
        ret[i]=fp_sub(v[i],e[i])
    }
    return ret

}
module.exports.GNeg = GNeg = function (v)
{
    var ret = new Array(v.length)
    for(var i=0;i<v.length;++i)
    {
        ret[i]=fp_neg(v[i])
    }
    return ret

}

module.exports.GInvert = GInvert = function (v)
{
    var ret = new Array(v.length)
    
    for(var i=0;i<v.length;++i)
    {
        ret[i]=bigint.inverseMod(v[i],ibe_q)
    }
    return ret

}

module.exports.GIsEqual = GIsEqual = function (a,b)
{
    for(var i=0;i<a.length;++i)
    {
        if(!bigint.equals(a[i],b[i]))
        {
            return false;
        }
    }
    return true;

}
module.exports.GIsZero = GIsZero = function (a)
{
    for(var i=0;i<a.length;++i)
    {
        if(!bigint.isZero(a[i]))
        {
            return false;
        }
    }
    return true;

}





module.exports.fp_add = fp_add = function (s1,s2)
{
    var s = bigint.add(s1,s2)
    if( bigint.greater(s,ibe_q) )
        s = bigint.sub(s,ibe_q)
    return s
}

module.exports.fp_sub = fp_sub = function (s1,s2)
{
    var s;
    if( bigint.greater(s2,s1) )
        s = bigint.sub(bigint.add(s1,ibe_q),s2)
    else
        s = bigint.sub(s1,s2)
    return s
}

module.exports.fp_sub_n = fp_sub_n = function (s1,s2)
{
    var s;
    if( bigint.greater(s2,s1) )
        s = bigint.sub(bigint.add(s1,ibe_q),s2)
    else
        s = bigint.sub(s1,s2)
    return s
}


module.exports.fp_invert = fp_invert = function (s)
{
    var ret = bigint.inverseMod(s,ibe_q)
    return ret 
}



module.exports.fp_mult = fp_mult = function (c3,c4)
{

    var _q="15028799613985034465755506450771565229282832217860390155996483840017"
    var q=bigint.str2bigInt(_q,10,0) 
    //var c=bigint.mult(c3,c4)
    //c = mod(c,ibe_q) 
    var c = bigint.multMod(c3,c4,ibe_q)
    return c 
}

module.exports.fp_neg = fp_neg = function (anum)
{
    var ret ;
    if(bigint.equalsInt(anum,0))
        ret = bigint.dup(anum)
    else
    {
        
        ret = bigint.sub(ibe_q,anum)
    }
    return ret 

}

module.exports.polymod_const_mul = polymod_const_mul = function (a,e)
{
    var res = new Array(e.length)
    for( var i=0;i<e.length;++i)
    {
        res[i]=fp_mult(a,e[i] )
    }
    return res
}


module.exports.polymod_mul_degree3 = polymod_mul_degree3 = function (e,f)
{

    var _xpwr=new Array(3)
    _xpwr[0]="3053610355725337299498468625544028297836124273177919204884624393825"
    _xpwr[1]="1595757413637099638012768355522018425276144655772136098584582477246"
    _xpwr[2]="6701335092867243227676401275323443222522968592352346660225596428403"
    var xpwr=G2BigInt(_xpwr)
    var _xpwr1=new Array(3)
    _xpwr1[0]="9385910079666998837875568805382738923761376323975517375834674752474"
    _xpwr1[1]="12727029633817405504618036300927848741686155698560986497611454569413"
    _xpwr1[2]="11293357710551192191735297347007133101291849005436098117914318596946"
    var xpwr1=G2BigInt(_xpwr1)

    var dst=new Array(3);


    var scratch = new Array(3);
    var c3 = fp_add(e[0],e[1])
    var c4 = fp_add(f[0],f[1])

    //document.write( bigint.bigInt2str(c3,10,0))
    //document.write('<br>')
    //document.write( bigint.bigInt2str(c4,10,0))
    //document.write('<br>')
    scratch[2]=fp_mult(c3,c4)

    c3 = fp_add(e[0],e[2])
    c4 = fp_add(f[0],f[2])
    scratch[1] = fp_mult(c3,c4)

    c3 = fp_add(e[1],e[2])
    c4 = fp_add(f[1],f[2])
    scratch[0] = fp_mult(c3,c4)

    //for ( var i=0; i< p2x.length; ++i)
    //{
    //    document.write( bigint.bigInt2str(scratch[i],10,0))
    //            document.write('<br>')
    //}

    dst[1] = fp_mult(e[1],f[1])
    dst[0] = fp_mult(e[0],f[0])
    c4 = fp_mult(e[2],f[2])
    c3 = fp_add(dst[1],c4)
    //c3=fp_sub(scratch[0],c3)
    c3=fp_sub(scratch[0],c3)

    //

    //document.write( bigint.bigInt2str(dst[1],10,0))
   //document.write( bigint.bigInt2str(c4,10,0))
    //document.write('<br>')

    dst[2] = fp_add(dst[0],c4)
    scratch[1] = fp_sub( scratch[1],dst[2])
    dst[2] = fp_add(dst[1],scratch[1])
    
    scratch[2] = fp_sub(scratch[2],dst[0])
    dst[1] = fp_sub(scratch[2],dst[1])


    //document.write( bigint.bigInt2str(xpwr1[0],10,0))
    //document.write('<br>')

    //p0 is always zeror . ignore following calc
    var p0 = new Array(3);

        //
    p0 = polymod_const_mul(c3,xpwr)
    dst = GAdd(dst,p0) 
    p0 = polymod_const_mul(c4,xpwr1)
    // 
    dst = GAdd(dst,p0) 
    return dst
}



module.exports.curve_double = curve_double = function (Z)
{
    var ret = new Array(2)
    if (bigint.equalsInt(Z[1],0))
    {
        ret[1]=bigint.str2bigInt("0",10,0)
        return  ret
    }
    else
    {
       var x=Z[0]  
       var y=Z[1]

       var lambda=fp_mult(x,x)
       _a = "1871224163624666631860092489128939059944978347142292177323825642096"   
       var a = bigint.str2bigInt(_a,10,0)
       lambda = fp_mult(lambda,bigint.str2bigInt("3",10,0))
       lambda = fp_add(lambda,a)
       var e0 = fp_add(y,y)
       
        //bitSizeTest
        //document.write( bigint.bitSize(ibe_q))
        //document.write( bpe )
        //document.write('<br>')
       e0=bigint.inverseMod(e0,ibe_q)
       lambda = fp_mult(lambda,e0)
       var e1 = fp_add(x,x)
       e0 = fp_mult(lambda,lambda)
       e0 = fp_sub(e0,e1)
       e1 = fp_sub(x,e0)
       e1 = fp_mult(e1,lambda)
       e1 = fp_sub(e1,y)

       ret[0] = e0
       ret[1] = e1
        
     
       return  ret 
    }
    
}

module.exports.curve_mul = curve_mul = function (p,q)
{
    var e0 = fp_sub(q[0],p[0])
    var ret = new Array(2)
    ret[0] = bigint.int2bigInt(0,1,1)
    ret[1] = bigint.int2bigInt(0,1,1)
  
  if(GIsZero(p)) {
    return bigint.dup(q)
  }
  if(GIsZero(q)) {
    return bigint.dup(p)
  }
    if( bigint.isZero(e0) )
    {

        if( bigint.isZero(fp_sub(q[1],p[1])))
        {

           if(bigint.isZero( p[1])) {
                return ret

           }
            else {
                return curve_double(p)
              }
        }
        else
            return ret
    }
    else

        e0 = bigint.inverseMod(e0,ibe_q)
    var lambda = fp_sub(q[1],p[1])
    lambda = fp_mult(lambda,e0)
    e0 = fp_mult(lambda,lambda)
    e0 = fp_sub(e0,p[0])
    e0 = fp_sub(e0,q[0])
    
    e1 = fp_sub(p[0],e0)
    e1 = fp_mult(e1,lambda)
    e1 = fp_sub(e1,p[1])

    ret[0] = e0
    ret[1] = e1
    
    return ret
}

module.exports.d_miller_eval_fun = d_miller_eval_fun = function (a,b,c,Qx,Qy)
{
    var e0 = new Array(2) 
    e0[0] = new Array(3)
    e0[1] = new Array(3)
    var d=3   
    for(i=0;i<d;++i)
    {
        e0[0][i] = fp_mult(Qx[i],a)
        e0[1][i] = fp_mult(Qy[i],b)
    }
    e0[0][0] = fp_add(e0[0][0],c)
    return e0
}

module.exports.fq_mul = fq_mul = function (a,b)
{
    var r = new Array(2) 
    var px = a[0]
    var py = a[1]
    var qx = b[0]
    var qy = b[1]

    var _nqrx=new Array(3)
    _nqrx[0]="142721363302176037340346936780070353538541593770301992936740616924"
    _nqrx[1]="0"  
    _nqrx[2]="0"
    nqrx = G2BigInt(_nqrx)
    
    var e0 = GAdd(px,py)
    var e1 = GAdd(qx,qy)
    
    var e2 = polymod_mul_degree3(e0,e1)
    e0 = polymod_mul_degree3(px,qx)
    e1 = polymod_mul_degree3(py,qy)
    r[0] = polymod_mul_degree3(e1,nqrx)
    r[0] = GAdd(r[0],e0)
    e2=GSub(e2,e0)
    r[1]=GSub(e2,e1)
    
    
    return r;
    
}

module.exports.poly_remove_leading_zeroes = poly_remove_leading_zeroes = function (e)
{
    var n = e.length - 1
    for( ; n >= 0; n--)
    {
        if( !bigint.isZero(e[n]) )
        {
            return ;
        }
        else
        {
            e.pop()
        }
    }
    return ;
}

module.exports.poly_div = poly_div = function (a,b)
{
    var qr = new Array(2)

    //b degree is not zero.
    
    var n=b.length-1 
    var m=a.length-1
    //document.write( "poly_div:"+m+n )
    //document.write('<br>')
    if(n>m)
    {
       qr[0]=[]
       qr[1]=a
       return qr
    }
    var k = m-n
    var pr = GDup(a) 
    var pq = new Array(k+1)
    
    //document.write( "poly_div:"+m+n )
    //document.write('<br>')
    var e0
    var binv = fp_invert(b[n])
    while( k>= 0)
    {
        pq[k]=fp_mult(binv,pr[m])
        for( var i = 0; i<=n; ++i)
        {
            e0 = fp_mult(pq[k],b[i])
            pr[i+k]=fp_sub(pr[i+k],e0)
        }
    

        k=k-1
        m=m-1
    } 
    poly_remove_leading_zeroes(pr)
    qr[0]=pq
    qr[1]=pr
      
    return qr
}

module.exports.poly_mul = poly_mul = function (f,g)
{
    var r = []
    var fcount=f.length
    var gcount=g.length
    if( fcount == 0 || gcount ==0 )
        return r
    var n = fcount+gcount-1
    var e0
    r = new Array(n)
    
        //document.write( "poly_mul "+n+fcount+gcount )
        //document.write('<br>')
    for( var i=0;i<n;++i)
    {
        r[i]= bigint.str2bigInt("0",10,0)
        for( var j=0;j<=i;++j)
        {
            if (j < fcount && i - j < gcount)
            {
                e0 = fp_mult(f[j],g[i-j])
                r[i] = fp_add(r[i],e0)
            }
            
        }
    }
    poly_remove_leading_zeroes(r) 
    return r
}
//in place res
module.exports.poly_const_mul = poly_const_mul = function (res,a,poly)
{
    var n=poly.length
    for(var i=0;i<n;i++)
    {
        res[i] = fp_mult(a,poly[i])
        
        //document.write( "exit " )
        //document.write('<br>')
    
        //document.write( "exit " )
        //document.write('<br>')
    }
    poly_remove_leading_zeroes(res)
}

module.exports.poly_sub = poly_sub = function (f,g)
{
    var diff
    var n = f.length
    var n1 = g.length
    var big

    var is_f_Big = false
    
    if( n > n1)
    {
       big = bigint.dup(f) 
       n = n1
       n1 = f.length
       is_f_Big = true
    }
    else
    {
        big = bigint.dup(g)
    }
    
    diff = new Array(n1)

    var i = 0
    for ( i=0;i<n;++i)
    {
        // 1-bigInt miss 9999. have to make a fp_sub_n version. makeup the 9999
        diff[i]=fp_sub_n(f[i],g[i])
    }
    for( ; i<n1;++i)
    {
        if(is_f_Big)
        {
            diff[i]=bigint.dup(big[i])
        }
        else
        {
            diff[i]=fp_neg(big[i])
        }
    }
    
    return diff 
}



module.exports.polymod_invert = polymod_invert = function (a)
{
    var out=new Array(3);
    var _p = new Array(4);
    
    _p[0]="11975189258259697166257037825227536931446707944682470951111859446192"
    _p[1]="13433042200347934827742738095249546804006687562088254057411901362771"
    _p[2]="8327464521117791238079105175448122006759863625508043495770887411614"
    _p[3]="1"
    
    //var p = G2BigInt(_p)

    var r0 = G2BigInt(_p)
    var r1 = bigint.dup(a)
    var r2 = []
    var q = []
    var b0 = []
    var b1 = new Array(1)
    b1[0] = bigint.int2bigInt(1,1,1)
    var b2

    for(;;)
    {
        var qr = poly_div(r0,r1) 
        q=qr[0]
        r2=qr[1]
        if( r2.length == 0) break;
        b2=poly_mul(b1,q)
        
        b2=poly_sub(b0,b2)
        b0=bigint.dup(b1)
        b1=bigint.dup(b2)
        r0=bigint.dup(r1)
        r1=bigint.dup(r2)

        
        //document.write( "poly_div one round " )
        //document.write('<br>')
    }
    
        //document.write( "poly_div after " )
        //document.write('<br>')
    
    
    var inv=fp_invert(r1[0])
    //document.write( "before out calc:" )
    //document.write('<br>')
    poly_const_mul( out, inv, b1)
    
    return out 
    //return a 
}

module.exports.fq_invert = fq_invert = function (a)
{
    var r= new Array(2);

    var _nqrx=new Array(3)
    _nqrx[0]="142721363302176037340346936780070353538541593770301992936740616924"
    _nqrx[1]="0"
    _nqrx[2]="0"
    nqrx = G2BigInt(_nqrx)

    e0 = polymod_mul_degree3(a[0],a[0])
    e1 = polymod_mul_degree3(a[1],a[1])
    e1 = polymod_mul_degree3(e1,nqrx)
    e0 = GSub(e0,e1)
        //document.write( "fq_invert" )
        //document.write('<br>')
        
        //document.write( "fq_invert" )
        //document.write('<br>')
    e0 = polymod_invert(e0)
    r[0] = polymod_mul_degree3(a[0],e0)
    e0 = GNeg(e0)
    r[1] = polymod_mul_degree3(a[1],e0)
    
    return r 
}

module.exports.polymod_is0 = polymod_is0 = function (a)
{
    for(var i=0; i<a.length;i++)
    {
        if(!bigint.isZero(a[i]))
            return false;
    } 
    return true;
}

module.exports.polymod_is1 = polymod_is1 = function (a)
{
    var n=a.length
    if(n == 0)
        return false
    if(!bigint.equalsInt(a[0],1)) return false;
    for(var i=1;i<n; i++)
    {
        if(!bigint.isZero(a[i])) return false;
    }
    
    return true;
    //a[i] 
}

module.exports.polymod_double = polymod_double = function (a)
{
    var res = new Array(a.length)
    for(var i=0; i<a.length;i++) 
    {
        res[i]=fp_add(a[i],a[i])
    }
    return res
}

module.exports.polymod_sub = polymod_sub = function (e,f) 
{
    var r = new Array(e.length);
    for(var i=0; i<e.length; ++i)
    {
        r[i]=fp_sub(e[i],f[i])
    }
    return r 
}

module.exports.polymod_halve = polymod_halve = function (a)
{
    var e0 = new Array(3)
    e0[0]=bigint.str2bigInt("7514399806992517232877753225385782614641416108930195077998241920009",10,0)
    e0[1]=bigint.str2bigInt("0",10,0)
    e0[2]=bigint.str2bigInt("0",10,0)
    var r = polymod_mul_degree3(a,e0)
    return r
}

module.exports.lucas_even = lucas_even = function (a, cofactor)
{
    //if( a[0] 
    if(polymod_is1(a[0]) && polymod_is0(a[1]))
        // Be ware I haven't make a bigint.dup
        return a
    var out = new Array(2);
    var t0 = new Array(3);
    t0[0] = bigint.str2bigInt("2",10,0)
    t0[1] = bigint.str2bigInt("0",10,0)
    t0[2] = bigint.str2bigInt("0",10,0)
    var t1=polymod_double(a[0])
    
    out[0]=GDup(t0)
    out[1]=GDup(t1)

    cofactorStr = bigint.bigInt2str(cofactor,2)
    j = cofactorStr.length - 1
    for(;;)
    {
        if(!j)
        {
            out[1]=polymod_mul_degree3(out[0],out[1])
            out[1]=GSub(out[1],t1)
            out[0]=polymod_mul_degree3(out[0],out[0])
            out[0]=GSub(out[0],t0)
            break;
        }
        if( cofactorStr.charAt(cofactorStr.length-j-1) == '1')
        {
            
            out[0]=polymod_mul_degree3(out[0],out[1])
            out[0]=GSub(out[0],t1)
            out[1]=polymod_mul_degree3(out[1],out[1])
            out[1]=GSub(out[1],t0)
        }
        else
        {
            out[1]=polymod_mul_degree3(out[0],out[1])
            out[1]=GSub(out[1],t1)
            out[0]=polymod_mul_degree3(out[0],out[0])
            out[0]=GSub(out[0],t0)
        }
        j--;
        
    }

   
    
    out[0]=polymod_double(out[0])
    a[0]=polymod_mul_degree3(t1,out[1])
    a[0]=GSub(a[0],out[0])
    
    t1 = polymod_mul_degree3(t1,t1)
    t1 = GSub(t1,t0)
    t1 = GSub(t1,t0)

    
    
    
    out[0]=polymod_halve(out[1])
    var t1inv=polymod_invert(t1)
    out[1]=polymod_mul_degree3(a[0],t1inv)
    out[1]=polymod_mul_degree3(out[1],a[1])

    return out
}


module.exports.cc_tatepower = cc_tatepower = function ( _in)
{
    var out;
    var _xpowq = new Array(3)
    _xpowq[0]="657521270017796069346395138181635563647395275435524050257477505788"
    _xpowq[1]="6866761136669758413861832255861003032305625478275258872526688545352"
    _xpowq[2]="2015629970386633557539271384842840627883763896393847647101244719938"
    var xpowq=G2BigInt(_xpowq)
    var _xpowq2 = new Array(3)
    _xpowq2[0]="7680052371975202795937705303411295551244651607969534772653536375608"
    _xpowq2[1]="11929925182031872553846797980141412727270917535480437433607306713575"
    _xpowq2[2]="8162038477315276051893674194910562196977206739585131283469795294664"
    var xpowq2=G2BigInt(_xpowq2)

    var e0 = new Array(2),e2 = new Array(3),e3 = new Array(2)
    var e0re,e0im  
    var e0re0,e0im0
    var _inre = _in[0]
    var _inim = _in[1]

    function qpower (sign)
    {
       e2 = polymod_const_mul(_inre[1],xpowq) 
       e0re = e2 

       e2 = polymod_const_mul(_inre[2],xpowq2) 
       e0re = GAdd(e0re,e2)

       e0re0 = e0re[0] 
       e0re0 = fp_add(e0re0,_inre[0])
    
       e0re[0] = e0re0
       e0[0]=e0re
       if(sign > 0)
        {
            e2 = polymod_const_mul(_inim[1],xpowq) 
            e0im = e2

            e2 = polymod_const_mul(_inim[2],xpowq2)
            e0im = GAdd(e0im,e2)
        
            e0im0 = e0im[0] 
            e0im0 = fp_add(e0im0,_inim[0])
            
            e0im[0] = e0im0
            e0[1] = e0im

        } 
        else
        {
            e2 = polymod_const_mul(_inim[1],xpowq) 
            e0im = GNeg(e2)

            e2 = polymod_const_mul(_inim[2],xpowq2)
            e0im = GSub(e0im,e2)
            
            e0im0 = e0im[0] 
            e0im0 = fp_sub(e0im0,_inim[0])

            e0im[0] = e0im0
            e0[1] = e0im
            
        }

    
    }

    qpower(1)
    

    //be ware of here . e3 = e0 doesn't work at all.
    //e3 = e0
    e3[0] = e0[0]
    e3[1] = e0[1]
    e0re = _in[0]
    e0im = GNeg(_in[1])
    
    
    e0[0] = e0re
    e0[1] = e0im
        
   // printArray(e0[0])
    
        //document.write( "fq_mul_begin" )
        //document.write('<br>')
    e3 =fq_mul(e3,e0)
        //document.write( "fq_mul_end" )
        //document.write('<br>')

    qpower(-1)
    e0 = fq_mul(e0,_in)
    e0 = fq_invert(e0)
    _in = fq_mul(e3,e0)
    
    e0[0] = _in[0]
    e0[1] = _in[1]

    
    
    var phikonr = bigint.str2bigInt("15028799613985034465755506450771569105982409691595259672696426485013",10,0)
    out = lucas_even(e0,phikonr)
    
    return out
    //return _in
    
}

module.exports.pairing = pairing = function (Px,Py,p2x,p2y)
{

    var out;
    _nqrinv=new Array(3)
    _nqrinv[0]="6041968486146819522833566161674844805011295865114179686064601307785"
    _nqrinv[1]="0"
    _nqrinv[2]="0"
    nqrinv = G2BigInt(_nqrinv);

    _nqrinv2= new Array(3)
    _nqrinv2[0]="12869220911900321812241940612176383961168937626526543351701949451131"
    _nqrinv2[1]="0"
    _nqrinv2[2]="0"
    nqrinv2 = G2BigInt(_nqrinv2);

    var Qx=polymod_mul_degree3(p2x,nqrinv) 
    var Qy=polymod_mul_degree3(p2y,nqrinv2)

    var _cca="1871224163624666631860092489128939059944978347142292177323825642096"
    var cca = bigint.str2bigInt(_cca,10,0)

    function do_tangent ()
    {
        
            //document.write( bigint.bigInt2str(q,10,0))
            //document.write('<br>')
            //bigint.addInt_(Zx,100)
           a = fp_mult(Zx,Zx)
           a = fp_mult(a,bigint.str2bigInt("3",10,0))
           a = fp_add(a,cca)
           a = fp_neg(a) 
           b = fp_add(Zy,Zy)
           t0 = fp_mult(b,Zy)
           c = fp_mult(a,Zx)
           c = fp_add(c,t0)
           c= fp_neg(c)
           e0=d_miller_eval_fun(a,b,c,Qx,Qy) 
           v = fq_mul(v,e0)
           vx = v[0]
           vy = v[1]
    }

    function do_line ()
    {
       b=fp_sub(Px,Zx) 
       a=fp_sub(Zy,Py)
       t0=fp_mult(b,Zy)
       c=fp_mult(a,Zx)
       c=fp_add(c,t0)
       c=fp_neg(c)
       e0=d_miller_eval_fun(a,b,c,Qx,Qy)

       v=fq_mul(v,e0)
       vx = v[0]
       vy = v[1]
        

    }
    var P = new Array(2)
    P[0] = Px
    P[1] = Py

    var Zx=bigint.dup(Px)
    var Zy=bigint.dup(Py)
    var Z=new Array(2)
    Z[0]=Zx
    Z[1]=Zy

    var _vx = new Array(3)
    _vx[0]="1"
    _vx[1]="0"
    _vx[2]="0"
    var vx = G2BigInt(_vx)
    var _vy = new Array(3)
    _vy[0]="0"
    _vy[1]="0"
    _vy[2]="0"
    var vy = G2BigInt(_vy)
    var v = new Array(2)
    v[0] = vx
    v[1] = vy
        

    var q=bigint.str2bigInt("15028799613985034465755506450771561352583254744125520639296541195021",10,0)
    var a
    var b
    var c
    var t0
    var e0
    //mpz size of q
    var m = 222
    var m_total = 224
    //var m_str = '10001110101101001111110011110101111010000011000110101100011110101011010110010001100011010110101010110110001000011010111101011010011001101001000110111011100111000011010001100100100011110010001001011001010001100111101100001101'
    var m_str = bigint.bigInt2str(q,2)
    //var m=1
    
    for(;;)  
    {
        do_tangent() 
        if(!m) break;
        //if(m==218) break;
        //element_double
        Z=curve_double(Z)
        Zx = Z[0]
        Zy = Z[1]
        
        //document.write( m + m_str.charAt(m_total-m-1))
        //document.write('<br>')
        //simple use this as tstbits
        if( m_str.charAt( m_total-m-1 ) == '1' )
        {
         do_line()
         Z=curve_mul(Z,P) 
         Zx=Z[0]
         Zy=Z[1]

        }

        m--
    

        v=fq_mul(v,v) 
        vx = v[0]
        vy = v[1]

        
    }
    
    out = cc_tatepower(v)

    return out
}
module.exports.G2_curve_double = G2_curve_double = function (Z)
{
    var ret = new Array(2)

    
       var x=Z[0]  
       var y=Z[1]
    if( GIsZero(x) && GIsZero(y) )
        return Z

       var lambda=polymod_mul_degree3(x,x)
       var _a =new Array(3)
       _a[0]= "814666024090928804996017557078651267356185679871471934426494531496"   
       _a[1]="0"
       _a[2]="0"
       var a = G2BigInt(_a)
       lambda = polymod_const_mul(bigint.str2bigInt("3",10,0),lambda)
    
       lambda = GAdd(lambda,a)
       var e0 = polymod_double(y)

       e0 = polymod_invert(e0)
       //var _q="15028799613985034465755506450771565229282832217860390155996483840017"
       //var q=bigint.str2bigInt(_q,10,0) 
       //
       // //bitSizeTest
       // //document.write( bigint.bitSize(q))
       // //document.write( bpe )
       // //document.write('<br>')
       //e0=bigint.inverseMod(e0,q)
       lambda = polymod_mul_degree3(lambda,e0)
       var e1 = polymod_double(x)
       e0 = polymod_mul_degree3(lambda,lambda)
       e0 = polymod_sub(e0,e1)
       e1 = polymod_sub(x,e0)
       e1 = polymod_mul_degree3(e1,lambda)
       e1 = polymod_sub(e1,y)

       ret[0] = e0
       ret[1] = e1
        
       return  ret
    
}


module.exports.G2_curve_mul = G2_curve_mul = function (p,q)
{
    var ret = new Array(2)
    if(GIsZero(p[0]) && GIsZero(p[1]))
    {    
        ret[0] = GDup(q[0])
        ret[1] = GDup(q[1])
        return GDup(q)
    }
    
    if( GIsEqual(p[0],q[0]) && GIsEqual(p[1],q[1]) )
    {
        
        return G2_curve_double(p) 
    }
    else
    {

    var e0 = polymod_sub(q[0],p[0])
    e0 = polymod_invert(e0)


    var lambda = polymod_sub(q[1],p[1])
    lambda = polymod_mul_degree3(lambda,e0)
    e0 = polymod_mul_degree3(lambda,lambda)
    e0 = polymod_sub(e0,p[0])
    e0 = polymod_sub(e0,q[0])
    //
    e1 = polymod_sub(p[0],e0)
    e1 = polymod_mul_degree3(e1,lambda)
    e1 = polymod_sub(e1,p[1])

    ret[0] = e0
    ret[1] = e1
    
    return ret
    }
}
module.exports.G2_build_pow_window = G2_build_pow_window = function (a,k)
{
    var sz = 16
    
   var a_lookup = new Array(16)

   //a_lookup[0] is not used
   a_lookup[1]=new Array(2)
   a_lookup[1][0]=GDup(a[0])
   a_lookup[1][1] =GDup(a[1])

   for(var s=2;s<sz;s++)
   {
       a_lookup[s]=G2_curve_mul(a_lookup[s-1],a)
    }

   return a_lookup
}


module.exports.GT_build_pow_window = GT_build_pow_window = function (a,k)
{
    var sz = 16
    
   var a_lookup = new Array(16)

   a_lookup[0]=new Array(2)
   a_lookup[0][0] = new Array(3)
   a_lookup[0][0][0]=bigint.int2bigInt(1,1,1)
   a_lookup[0][0][1]=bigint.int2bigInt(0,1,1)
   a_lookup[0][0][2]=bigint.int2bigInt(0,1,1)
   a_lookup[0][1] = new Array(3)
   a_lookup[0][1][0]=bigint.int2bigInt(0,1,1)
   a_lookup[0][1][1]=bigint.int2bigInt(0,1,1)
   a_lookup[0][1][2]=bigint.int2bigInt(0,1,1)

   for(var s=1;s<sz;s++)
   {
       a_lookup[s]=fq_mul(a_lookup[s-1],a)
    }

   return a_lookup
}

module.exports.build_pow_window_extract = build_pow_window_extract = function (a,k)
{
    var sz = 16
    
   var a_lookup = new Array(sz)

   a_lookup[0] = new Array(2)
   a_lookup[0][0]=bigint.int2bigInt(0,1,1)
   a_lookup[0][1] = bigint.int2bigInt(0,1,1)

   a_lookup[1] = GDup(a)
   for(var s=2;s<sz;s++)
   {
       a_lookup[s]=curve_mul(a_lookup[s-1],a)
    }

   return a_lookup
}

module.exports.element_pow_wind_extract = element_pow_wind_extract = function (x,n)
{
   //pow 0 raise error later 
    
   var result = new Array(2)
   result[0] = bigint.int2bigInt(0,1,1)
   result[1] = bigint.int2bigInt(0,1,1)

   var k = 4

   var a_lookup = build_pow_window_extract(x)

   var nstr = bigint.bigInt2str(n,2)

    var inword,s;
    var word=0;
    var wbits=0
   for(inword=0,s=nstr.length-1;s>=0;s--)
   {
     var bit=(nstr.charAt( nstr.length-s-1 ) == '1')
     result = curve_mul(result,result)

     if(!inword && !bit)
        continue
       
     if(bit)
        bit = 1
      else
        bit = 0
    
      if(!inword)
      {
        inword=1;
        word=1
        wbits=1
      }
      else
      {
        word = word*2+bit
        wbits++
      }
    if (wbits == k || s == 0) { 
      result = curve_mul(result,a_lookup[word])
      inword = 0
    }
        
   }


   return result 

}



module.exports.build_pow_window_G1 = build_pow_window_G1 = function (a,k)
{
    var sz = 4
    
   var a_lookup = new Array(4)

   a_lookup[0] = new Array(2)
   a_lookup[0][0]=bigint.int2bigInt(0,1,1)
   a_lookup[0][1] = bigint.int2bigInt(0,1,1)

   a_lookup[1] = GDup(a)
   for(var s=2;s<sz;s++)
   {

       a_lookup[s]=curve_mul(a_lookup[s-1],a)
       // printMark("a_lookup")
       // printArray(a_lookup[s])
    }
   return a_lookup
}
//it takes 5 seconds...
module.exports.G2_pow = G2_pow = function (x, n)
{
   //pow 0 raise error later 
    
   var result = new Array(2)
   result[0] = new Array(3)
   result[0][0]=bigint.int2bigInt(0,1,1)
   result[0][1]=bigint.int2bigInt(0,1,1)
   result[0][2]=bigint.int2bigInt(0,1,1)
   result[1] = new Array(3)
   result[1][0]=bigint.int2bigInt(0,1,1)
   result[1][1]=bigint.int2bigInt(0,1,1)
   result[1][2]=bigint.int2bigInt(0,1,1)

   var k = 4

   var a_lookup = G2_build_pow_window(x,k)

   var nstr = bigint.bigInt2str(n,2)

    var inword,s;
    var word=0;
    var wbits=0
   for(inword=0,s=nstr.length-1;s>=0;s--)
   {
       var bit=(nstr.charAt( nstr.length-s-1 ) == '1')
       result = G2_curve_double(result,result)
       if(!inword && !bit)
            continue
         
       if(bit)
           bit = 1
        else
            bit = 0
    
      if(!inword)
      {
        inword=1;
        word=1
        wbits=1
      }
      else
      {
        word = word*2+bit
        wbits++
      }
    if (wbits == k || s == 0) { 
        result = G2_curve_mul(result,a_lookup[word])
        inword = 0
        
    }
        
   }


   return result 

}

module.exports.GT_pow = GT_pow = function (x,n)
{
   //pow 0 raise error later 
    
   var result = new Array(2)
   result[0] = new Array(3)
   result[0][0]=bigint.int2bigInt(1,1,1)
   result[0][1]=bigint.int2bigInt(0,1,1)
   result[0][2]=bigint.int2bigInt(0,1,1)
   result[1] = new Array(3)
   result[1][0]=bigint.int2bigInt(0,1,1)
   result[1][1]=bigint.int2bigInt(0,1,1)
   result[1][2]=bigint.int2bigInt(0,1,1)

   var k = 4

   var a_lookup = GT_build_pow_window(x)

   var nstr = bigint.bigInt2str(n,2)

    var inword,s;
    var word=0;
    var wbits=0
   for(inword=0,s=nstr.length-1;s>=0;s--)
   {
       var bit=(nstr.charAt( nstr.length-s-1 ) == '1')
       result = fq_mul(result,result)

       if(!inword && !bit)
            continue
         
       if(bit)
           bit = 1
        else
            bit = 0
    
      if(!inword)
      {
        inword=1;
        word=1
        wbits=1
      }
      else
      {
        word = word*2+bit
        wbits++
      }
    if (wbits == k || s == 0) { 
        result = fq_mul(result,a_lookup[word])
        inword = 0
        
    }
        
   }


   return result 

}

module.exports.element_pow_wind_G1 = element_pow_wind_G1 = function (x,n)
{
   //pow 0 raise error later 
    
   var result = new Array(2)
   result[0] = bigint.int2bigInt(0,1,1)
   result[1] = bigint.int2bigInt(0,1,1)

   var k = 2

   var a_lookup = build_pow_window_G1(x, n)

   var nstr = bigint.bigInt2str(n,2)

    var inword,s;
    var word=0;
    var wbits=0
   for(inword=0,s=nstr.length-1;s>=0;s--)
   {
       var bit=(nstr.charAt( nstr.length-s-1 ) == '1')
       result = curve_mul(result,result)

       if(!inword && !bit)
            continue
         
       if(bit)
           bit = 1
        else
            bit = 0
    
      if(!inword)
      {
        inword=1;
        word=1
        wbits=1
      }
      else
      {
        word = word*2+bit
        wbits++
      }
    if (wbits == k || s == 0) { 
        result = curve_mul(result,a_lookup[word])
        inword = 0
        
    }
        
   }

   return result 

}

module.exports.jacobi = jacobi = function (a,n)
{
    var bone = bigint.int2bigInt(1,1,1)
    var btwo = bigint.int2bigInt(2,2,1)
    //var beight = bigint.int2bigInt(8,4,1)
            
    if (bigint.isZero(a))
    {
        return  0
    }
    if (bigint.equalsInt(a,1))
        return  1
    if (bigint.equalsInt(a,2))
    {
        var n8 = bigint.modInt(n,8)
        if(n8 == 3 || n8 == 5)
        {
            return -1
        }
        else    
        {
            return 1  
        }
    }

    if(bigint.modInt(a,2)==0)
    {
        var ad2 =bigint.dup(a)
        var ar =bigint.dup(a)
        bigint.divide_( a, btwo, ad2,ar )
        return jacobi(btwo,n) * jacobi(ad2,n)
    }
    
    if(bigint.greater(a,n))
    {
        var ad2 =bigint.dup(a)
        var ar =bigint.dup(a)
        bigint.divide_( a, n, ad2,ar )
        return jacobi(ar,n)
    }
    
    if(bigint.modInt(a,4) == 3 && bigint.modInt(n,4) == 3)
    {
        return -1*jacobi(n,a)
    }
    else
        return jacobi(n,a)
    
}

module.exports.legendre_q = legendre_q = function (a)
{
    
    var qm1d2 = bigint.str2bigInt("7514399806992517232877753225385782614641416108930195077998241920008",10,0)
    var qm1 = bigint.str2bigInt("15028799613985034465755506450771565229282832217860390155996483840016",10,0)
    var ls=bigint.powMod(a,qm1d2,ibe_q)
    
    if(bigint.isZero(a))
        return 0
    
    if( bigint.equalsInt(ls,qm1) )
         return -1
    
    else
        return 1
}

module.exports.mod_sqrt = mod_sqrt = function (a,p)
{
    if(bigint.isZero(a))
        return bigint.int2bigInt(0,1,1)
    else if (bigint.equalsInt(p,2))
        return p
    //else if p%4==3 return pow(a,(p+1)/4,p)

    var p = bigint.str2bigInt("15028799613985034465755506450771565229282832217860390155996483840017",10,0)
    //var s = bigint.str2bigInt("15028799613985034465755506450771565229282832217860390155996483840016",10,0)
    // pre calculated.
    var e = 3 

    var n = 5
    var sp1d4 = bigint.str2bigInt("469649987937032327054859576586611413415088506808137192374890120001",10,0)
    var s = bigint.str2bigInt("939299975874064654109719153173222826830177013616274384749780240001",10,0)
    var stwo = bigint.int2bigInt(2,2,1)
    
    var x=bigint.powMod(a,sp1d4,p)
    var b=bigint.powMod(a,s,p)
    var g=bigint.powMod(bigint.str2bigInt("5",10,0),s,p)
    var r = 4
    for(;;)
    {
        var t = bigint.dup(b)
        var m = 0;
        for(;m<r;++m)
        {
            if(bigint.equalsInt(t,1))
                break;
            t = bigint.multMod(t,t,p)
        }
        if( m == 0) 
        {
            return x
        }
        
        
        var rmm1 = bigint.powMod(stwo,bigint.int2bigInt( r-m-1,4,1 ), p)
        var gs = bigint.powMod(g,rmm1,p)
        g =  bigint.multMod(gs,gs,p)
        x = bigint.multMod(x,gs,p)
        b = bigint.multMod(b,g,p)
        r=m
    }


    

}

module.exports.G1_from_hash = G1_from_hash = function (a)
{
    
    //var x=bigint.str2bigInt("3824322377327390281075901559054753441969158872320107172509333127642",10,0)
    //var x=bigint.str2bigInt("5810624218142754477456276241355967585043855821381859799690296306626",10,0)
    //var x=bigint.str2bigInt("0160c2f88e5e4e7c6bdffa26d6a7ecd42b2db84b000160c2f88e5e4e",16,0)

    
    var s0=ibe_hash( String.fromCharCode(1,0,0,0,0,0,0,0)+a)
    //to little endian
    var mcord=[6,6,2,2,-2,-2,-6,-6]
    var s1 = ""
    for(var i=0;i<s0.length;++i)
        s1+=s0[mcord[i%8]+i]

    //H || 0 || H || 1 || 
    //total 28 Byte
    var s=s1+"00"+s1.substr(0,14)
    
    //to bigInt
    var x=bigint.str2bigInt(s,16,0)
    if(bigint.greater(x,ibe_q))
        bigint.rightShift_(x,1)
    var t;
    var a = bigint.str2bigInt("1871224163624666631860092489128939059944978347142292177323825642096",10,0)
    var b = bigint.str2bigInt("9795501723343380547144152006776653149306466138012730640114125605701",10,0)

    var cofac = bigint.str2bigInt("9795501723343380547144152006776653149306466138012730640114125605701",10,0)
    
    for(;;)
    {
        t=fp_mult(x,x)
        t=fp_add(t,a)
        t=fp_mult(t,x) 
        t=fp_add(t,b)
        if( jacobi(t,ibe_q) == 1 ) break;
        //if( legendre_q(t) == 1 ) break;
        x = fp_mult(x,x) 
        x = bigint.addInt(x,1)
    } 
    var y = mod_sqrt(t,ibe_q)
    var yn = fp_neg(y)
    //if( bigint.greater(yn,y) )
        y=yn
    
   // printElem(y)
    
    var ret = new Array(2)
    ret[0] = x
    ret[1] = y
    
    //seems no need to do pow_wind_G1, just return
    //ret = element_pow_wind_G1(ret,cofac)

    return ret
}

module.exports.gen_U = gen_U = function (r)
{
    var _px=new Array(3)

    _px[0]="13811081979843030123575683961364195098182780905035434741449961170701"
    _px[1]="5168311754219690299065397857137804743287622694314500894713928555910"
    _px[2]="8811934331084896044063754515309978334585216131609973100543622590549"
    var _py=new Array(3)
    _py[0]="11978937640305627329722610355100010500665621620036973046712737173409"
    _py[1]="4386115112854559530338202238348812530267878704872566762635368727761"
    _py[2]="10391044986192973973988118337245431673037549976707601333607548174896"

    var px=G2BigInt(_px)
    var py=G2BigInt(_py)
    var p=new Array(2)
    p[0]=px
    p[1]=py

    var U = G2_pow(p,r)
    var k = 4
    //var a_lookup = G2_build_pow_window(p,k)

  return U


}

module.exports.xor = xor = function (str,key)
{
  var encStr="";
  for(var i=0;i<str.length;i++)
  {
    encStr+=String.fromCharCode( str.charCodeAt(i) ^ key.charCodeAt(i%key.length) )
  }
  return encStr
}

module.exports.array_to_G2 = array_to_G2 = function ( strArray )
{
  var ret = new Array(2)
  for( var i=0;i<2;i++)
  {
    ret[i] = new Array(3)
    for( var j=0;j<3;j++)
    {
      ret[i][j]=bigint.str2bigInt(strArray[i][j],10,0)
    } 
  }
  return ret
}

module.exports.array_to_G1 = array_to_G1 = function ( strArray)
{
  
  var ret = new Array(2)
  for( var i=0;i<2;i++)
  {
    ret[i] = bigint.str2bigInt(strArray[i],10,0)
  }
  return ret
}

import Script from 'next/script';

export default function ThemeScript(){
  const code = `(function(){
    try{
      var t = localStorage.getItem('theme') || 'aurora';
      document.documentElement.setAttribute('data-theme', t);
    }catch(e){}
  })();`;
  return <Script id="theme-script" strategy="beforeInteractive">{code}</Script>;
}

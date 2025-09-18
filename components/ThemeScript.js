export default function ThemeScript() {
  const code = `(function(){
    try{
      var t = localStorage.getItem('theme');
      if (t!=='light' && t!=='dark') t='dark';
      var el = document.documentElement;
      el.setAttribute('data-theme', t);
      if (t==='dark') el.classList.add('dark'); else el.classList.remove('dark');
    }catch(e){ document.documentElement.setAttribute('data-theme','dark'); document.documentElement.classList.add('dark'); }
  })();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

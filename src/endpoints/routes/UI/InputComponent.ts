export const InputComponent = (): string => {
  return `<script>
    function onSubmitInput(ev)
    {
        if(ev) ev.preventDefault();
        const inputEl =  document.getElementById("query");
        const value = inputEl.value;
        fetch('/api/input', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: value })
        })
            .then(response => response.json())
            .then(() => inputEl.value = "" )
            .catch(e => console.error(e) )  
    }
  </script>
  <div> 
    <h1>Input</h1>    
    <input type="text" id="query"  />
    <button onclick="onSubmitInput()">Envoyer</button>    
  </div>`;
};

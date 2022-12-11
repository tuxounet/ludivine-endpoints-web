export const EventsComponent = (): string => {
  return `
<script>
const events = new EventSource('/api/events');
let facts = []
events.onmessage = (event) => {
  const newEvent = JSON.parse(event.data);
  const eventsList  = document.getElementById("events") 
  for(const fact of newEvent)
  {
    const li = document.createElement("li");
    li.innerText = JSON.stringify(fact);
    eventsList.appendChild(li)
    facts.push(fact)     
  }
};
</script>
<div> 
  <h1>Events</h1>
  <ul id="events">
  </ul>
</div>`;
};

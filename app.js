var courseAPI = 'https://express-ts-ruby.vercel.app/api/fetch/data'

function start(){
    getCourse(renderCoures)
}

start()

function getCourse(callback){
    fetch(courseAPI)
        .then(function(response){
            return response.json();
        })
        .then(callback)
}
function renderCoures(courses){
    const oneDay = 24*3600e3
    const METRIC_NAME = {
        t : "THỜI GIAN",
        VO : "ĐIỆN ÁP",
        TE : "NHIỆT ĐỘ",
        RA : "LƯỢNG MƯA"
    }
   
const allDays = courses.sort((a,b)=>a.r-b.r).map(e=> new Date(e.t).toLocaleDateString('en-gb')).filter((e,index,arr) => arr.indexOf(e) === index )

const container = document.getElementById('home')
const tbodytable = document.getElementById('tbody-table')
allDays.forEach((day,index)=>{

  const [date,month,year] = day.split('/').map(e => e=+e)
  const startOfDay = new Date(year, month-1, date).getTime()
  const endOfDay = startOfDay + oneDay - 1;
  


  //create hearder table
  const hearder = Object.keys(courses[0]).map(e => METRIC_NAME[e])
  const tr = document.createElement('tr')
  hearder.forEach(e=> tr.innerHTML += `<th>${e}</th>`)


  //process data (lấy ra tất cả đối tượng cùng chung  1 ngày)
  const body = courses.filter(e=>{
    const t = e.t
    if(t >= startOfDay && t <= endOfDay){
      return e
    }
  })



  const result = {}  //Vo Te Ra : lưu giữ các giá trị cao thấp tb trong 1 ngày
  Object.keys(courses[0]).filter(e=> e!=='t').forEach(e=>{
    const arr = body.map(m => m[e])
    const max = Math.max(...arr)
    const min = Math.min(...arr)
    const avg = arr.reduce((total,el)=>total+=el)/arr.length
    result[e] = [max,min,avg.toFixed(5)]
  })


  
  //create tbody table
  const tbody = document.createElement('tbody')
  body.sort((a,b)=> a.t - b.t).forEach(e=>{
    const tr = document.createElement('tr')
    Object.keys(e).forEach(k =>{
      if(k === 't'){
        tr.innerHTML += `<td>${new Date(e[k] * 10e2).getHours()}h</td>`;
      }else{
        if (e[k] !== 0) {
          if (result[k][0] === e[k]) tr.innerHTML += `<td style="background-color : red"}>${e[k]}</td>`
          if (result[k][1] === e[k]) tr.innerHTML += `<td style="background-color : green"}>${e[k]}</td>`
          if (![result[k][0], result[k][1]].includes(e[k])) tr.innerHTML += `<td>${e[k]}</td>`
      } else {
          tr.innerHTML += `<td>${e[k]}</td>`
      }
      }
    })
    tbody.appendChild(tr)
  })


  //add element vào container
  container.innerHTML += `
  <h2 class="accordion-header" id="flushHeading">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
          data-bs-target="#flushCollapse${index}" aria-expanded="false" aria-controls="flushCollapse${index}">
              ${day}
      </button>
  </h2>
  <div id="flushCollapse${index}" class="accordion-collapse collapse" aria-labelledby="flush-headingOne"
      data-bs-parent="#accordionFlushExample">
  <div class="accordion-body">
      <table class="table table-striped">
          <thead>
            ${tr.innerHTML}
          </thead>
          ${tbody.innerHTML}
      </table>
  </div>`


   //TAB2 = THỐNG KÊ
    const trTable = document.createElement('tr')
    trTable.className= 'text-center'
    trTable.innerHTML += `
      <td>${day}</day>
    `
    Object.values(result).forEach(e=>{
      const [max, min, avg] = e
      trTable.innerHTML += `
        <td>${max}</day>
        <td>${min}</day>
        <td>${avg}</day>
    `
    })
    tbodytable.appendChild(trTable)

})
}


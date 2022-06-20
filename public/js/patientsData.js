const search = document.querySelector('input');
const Print = document.querySelector('button');

search.addEventListener('keyup', () => {
  var filter = document.querySelector("input").value.toUpperCase(),
    table = document.querySelector("table"),
    tr = table.getElementsByTagName("tr"),
    td, txtValue;

  for (let i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
});

Print.addEventListener('click', () => {
  var printWindow = window.open('', '', 'height=500,width=1000');
  printWindow.document.write('<html><head><title>Table Contents</title>');

  //Print the Table CSS.
  var table_style = `#dvContents {
                      width: 100%;
                      color: black;
                      font-family: "poppins", sans-serif;
                    }
                    .table {
                      border-collapse: collapse;
                      width: 100%;
                      margin-top: 50px;
                      text-align: left;
                    }

                    table th {
                      color: black;
                      font-weight: bold;
                    }

                    table th,
                    table td {
                      padding: 10px;
                      border-bottom: 1px solid black;
                    }
                    `;
  printWindow.document.write('<style type = "text/css">');
  printWindow.document.write(table_style);
  printWindow.document.write('</style>');
  printWindow.document.write('</head>');

  //Print the DIV contents i.e. the HTML Table.
  printWindow.document.write('<body>');
  var divContents = document.getElementById("dvContents").innerHTML;
  printWindow.document.write(divContents);
  printWindow.document.write('</body>');

  printWindow.document.write('</html>');
  printWindow.document.close();
  printWindow.print();
});


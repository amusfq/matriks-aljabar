
$(document).ready( () => {
    changeInput('a');
    changeInput('b');

    $('#btn-plus').click( e => {
        e.preventDefault();
        arit('+')
    })

    $('#btn-minus').click( e => {
        e.preventDefault();
        arit('-')
    })

    $('#btn-multi').click( e => {
        e.preventDefault();
        arit('x')
    })
});

function arit(act) {
    resetAll();
    try {
        const arrA = getArray('a');
        const arrB = getArray('b');
        let plus;
        if (act === '+') {
            plus = math.add(arrA, arrB);
        } else if (act === '-') {
            plus = math.subtract(arrA, arrB);
        } else if (act === 'x') {
            plus = math.multiply(arrA, arrB);
        }
        outputInput(arrA._data, 'q-A');
        outputInput(arrB._data, 'q-B')
    
        outputArr(plus._data);

        $("[id^='matrix-q-']").removeClass('hidden');
        $("[id^='label-']").removeClass('hidden');
        $('#operate').removeClass('hidden');
        $('#operate').html(act);
        $('#equal').removeClass('hidden');
        $('#matrix-output').removeClass('hidden');
    } catch (e) {
        $('#error').removeClass('hidden');
        $('#error').html('<strong>Error!</strong> ' + e.message);
    }
}

window.determinant = function (type) {
    resetAll();
    const result = getArray(type);
    try {
        let hasil = math.det(result)
        outputInput(result._data, 'quest');
        $('#output-type').html('det ' + type.toUpperCase());
        $('#output-text').html(hasil);
        $('#equal').removeClass('hidden');
        $('#output-text').removeClass('hidden');
    } catch (e) {
        $('#error').removeClass('hidden');
        $('#error').html('<strong>Error!</strong> ' + e.message);
    }
}

window.inverse = function (type) {
    resetAll();
    const result = getArray(type);
    try {
        const hasil = math.inv(result);
        outputArr(hasil._data);
        $('#output-type').html(type.toUpperCase()+ '<sup>-1</sup>');
        outputInput(result._data, 'quest');
    } catch (e) {
        let msg;
        if (e.message == 'Cannot calculate inverse, determinant is zero') {
            msg = 'Tidak bisa menghitung invers, hasil determinan 0';
        } else {
            msg = e.message
        }
        $('#error').removeClass('hidden');
        $('#error').html('<strong>Error!</strong> ' + msg);
    }
}

window.eigen = function (type) {
    resetAll();
    try {
        // load the numeric.js library
        const numeric = require('numeric')
      
        // import the numeric.js library into math.js
        math.import(numeric, { wrap: true, silent: true })
        const result = getArray('a');
        if (math.eig) {
          // calculate eigenvalues of a matrix
          let eigen = math.evaluate('eig('+result+')').lambda.x
          let x1 = "$ \\begin{aligned} A & = "
          let x2 = "\\begin{pmatrix}"
                    for (var i=0; i < result._data.length; i++) {
                        let temp = "";
                        for (var j=0; j < result._data[i].length; j++) {
                            temp += result._data[i][j] + "&"
                        }
                        x2 += temp.slice(0, -1)+ "\\\\"
                    }
                x2 += "\\end{pmatrix}"
          let x3= " \\\\ \\\\f(\\lambda) & = det(A-\\lambda1)\\\\ \\\\" 
          let x4= "f(\\lambda) & = det" + x2 +
                  "- \\lambda \\begin{pmatrix} "

                  for (var i=0; i < result._data.length; i ++ ) {
                      let temp = "";
                      for (var j=0; j < result._data[i].length; j ++) {
                        if (i == j) {
                            temp += "1 &";
                        } else {
                            temp += "0 &";
                        }
                      }
                      x4 +=temp.slice(0, -1)+ "\\\\"
                  }

                x4 += " \\end{pmatrix} " + 
                  "= det\\begin{pmatrix} "
                  
                  for (var i=0; i < result._data.length; i ++ ) {
                    let temp = "";
                    for (var j=0; j < result._data[i].length; j ++) {
                      if (i == j) {
                          temp += result._data[i][j] + " - \\lambda &";
                      } else {
                          temp += result._data[i][j] + " &";
                      }
                    }
                    x4 +=temp.slice(0, -1)+ "\\\\"
                }
                x4+= " \\end{pmatrix} \\\\" 
        let x5 = ""
        for (var i = 0; i < eigen.length; i++) {
            x5 += "x_{"+(i+1)+"} & = "+eigen[i].toFixed(2)+" \\\\" 
        }
          let x6 = "\\end{aligned} $"

            let hasil = x1 + x2 + x3 + x4 + x5 + x6;

            $('#output-text').addClass('normal')
          $('#output-text').html(hasil)

            MathJax.typeset()
        }
      } catch (err) {
        let msg = 'Ordo matriks harus sama';
        $('#error').removeClass('hidden');
        $('#error').html('<strong>Error!</strong> ' + msg);
      }
}

function resetAll () {
    $('#error').addClass('hidden');
    var outputMatrix = $('#matrix-output');
    outputMatrix.html('');
    outputMatrix.addClass('hidden');
    var outputText = $('#output-text');
    outputText.removeClass('normal')
    outputText.html('')
    $('#equal').addClass('hidden');
    $('#output-type').html('');;
    $('#matrix-quest').addClass('hidden');
    $("[id^='matrix-q-']").addClass('hidden');
    $("[id^='label-']").addClass('hidden');
    $('#operate').addClass('hidden');
}

function getArray(type) {
    var data = $('#form-' + type).serializeArray();
    var matrix_row = $('#matrix-'+type+'-row').val();
    var matrix_col = $('#matrix-'+type+'-col').val();
    var arr = math.matrix();
    arr.resize([parseInt(matrix_row), parseInt(matrix_col)]);
    for (var i=0; i < data.length; i ++) {
        var key = data[i].name.split('-');
        var value = data[i].value;
        var baris = parseInt(key[1]);
        var kolom = parseInt(key[2]);
        arr.subset(math.index(baris, kolom), value);
    }
    return arr;
}

function outputInput(array, type) {
    var output = $('#matrix-' + type);
    output.removeClass('hidden');
    $('#equal').removeClass('hidden');
    output.html('');
    for (var i=0; i < array.length; i++) {
        output.append('<div class="baris" id="baris-'+type+'-' + i + '"></div>');
        $.each(array[i], (index, value) => {
            $('#baris-'+type+'-' + i).append('<input type="text" class="matrix-output kolom" value="'+value+'" readonly/>');
        });3
    }
}

function outputText(data) {
    var output = $('#matrix-output');
    output.removeClass('hidden');
    output.html('');
    $('#equal').removeClass('hidden');
}

function outputArr(array) {
    var output = $('#matrix-output');
    output.removeClass('hidden');
    output.html('');
    for (var i=0; i < array.length; i++) {
        output.append('<div class="baris" id="baris-out-' + i + '"></div>');
        $.each(array[i], (index, value) => {
            $('#baris-out-' + i).append('<input type="text" class="matrix-output kolom" value="'+value+'" readonly/>');
        });
    }
}

window.changeInput = function (type) {
    var input = $('#matrix-'+type+'-input');
    input.html('');
    var matrix_row = $('#matrix-'+type+'-row').val();
    var matrix_col = $('#matrix-'+type+'-col').val();

    for (var i=0; i<matrix_row; i++) {
        var baris = '<div class="baris" id="baris'+type+'-' + i + '" name="baris'+type+'-' + i + '"></div>';
        input.append(baris);
        for (var j=0; j < matrix_col; j ++) {
            var kolom = '<input type="number" class="matrix-input kolom" id="kolom'+type+'-'+i+'-'+j+'" name="kolom'+type+'-'+i+'-'+j+'" value="0"/>';
            $("#baris"+type+"-"+i).append(kolom);
        }
    }
}
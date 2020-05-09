$(document).ready( () => {
    changeInputA();
    changeInputB();

    $('#btn-det-a').click( e => {
        e.preventDefault();
        deter('a');
    });

    $('#btn-det-b').click( e => {
        e.preventDefault();
        deter('b');
    });

    $('#btn-inv-a').click( e => {
        e.preventDefault();
        inverse('a');
    });

    $('#btn-inv-b').click( e => {
        e.preventDefault();
        inverse('b');
    });

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

function deter (type) {
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

function inverse(type) {
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

function resetAll () {
    $('#error').addClass('hidden');
    var outputMatrix = $('#matrix-output');
    outputMatrix.html('');
    outputMatrix.addClass('hidden');
    var outputText = $('#output-text');
    outputText.addClass('hidden');
    $('#equal').addClass('hidden');
    $('#output-text').addClass('hidden');
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
        });
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

function changeInputA() {
    var inputA = $('#matrix-a-input');
    inputA.html('');
    var matrix_a_row = $('#matrix-a-row').val();
    var matrix_a_col = $('#matrix-a-col').val();

    for (var i=0; i<matrix_a_row; i++) {
        var baris = '<div class="baris" id="barisA-' + i + '" name="barisA-' + i + '"></div>';
        inputA.append(baris);
        for (var j=0; j < matrix_a_col; j ++) {
            var kolom = '<input type="number" min="0" class="matrix-input kolom" id="kolomA-'+i+'-'+j+'" name="kolomA-'+i+'-'+j+'" value="0"/>';
            $("#barisA-"+i).append(kolom);
        }
    }
}

function changeInputB() {
    var inputB = $('#matrix-b-input');
    inputB.html('');
    var matrix_b_row = $('#matrix-b-row').val();
    var matrix_b_col = $('#matrix-b-col').val();
    for (var i=0; i<matrix_b_row; i++) {
        var baris = '<div class="baris" id="barisB-' + i + '" name="barisB-' + i + '"></div>';
        inputB.append(baris);
        for (var j=0; j < matrix_b_col; j ++) {
            var kolom = '<input type="number" min="0" class="matrix-input kolom" id="kolomB-'+i+'-'+j+'" name="kolomB-'+i+'-'+j+'" value="0"/>';
            $("#barisB-"+i).append(kolom);
        }
    }    
}
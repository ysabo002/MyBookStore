﻿$(document).ready(function () {


    $('#booksTable').DataTable({
        dom: "lftip",
        responsive: true,
        ordering: true,
        paging: true,
        lengthMenu: [10, 20, 30, 40, 50],
        language: {
            zeroRecords: "No data available",
            infoEmpty: "No records available",

        },
        columnDefs: [
            {
                targets: [7],
                class: "text-center ",

                render: function (dataCell, display, dataRow) {
                    var stars = '';

                    for (var i = 0; i < dataCell; i++) {
                        stars += '<span class="fas text-warning fa-star fa-xs"></span>'
                    }
                   
                    return  stars + dataCell;

                },
            },
            {
                targets: [10],
                render: function (dataCell, display, dataRow) {
                    let div = `<div class="text-center">
                                    <a class="btn edit-book" data-action="edit" href="/Books/Edit/`+ dataCell + `"><i class="fas fa-edit float-right link-list-item text-primary edit-book-type"></i></a>
                                    <a class="btn delete-book" data-action="delete" href="/Books/Delete/`+ dataCell + `"><i class="fas fa-trash float-right link-list-item text-danger delete-book-type"></i></button>
                                    <a class="btn details-book" data-action="details" href="/Books/Details/`+ dataCell + `"><i class="fas fa-eye float-right link-list-item text-primary details-book-type"></i></button>
                                    <a class="btn add-to-cart-book" data-action="add-to-cart" href="#"><i class="fas fa-cart-plus float-right link-list-item text-primary details-book-type"></i></button>
                                </div>`
                    return div;
                }
            }
        ],
        initComplete: function () {
            var table = this.api();
            table.columns().every(function () {
                var column = this;
                var columnIdx = column[0];
                if (columnIdx == 2 || columnIdx == 3 || columnIdx == 5) {
                    var select = $('<select style="background-color:lightslategray; border: none; border-radius: 8px;color: white; padding: 15px 32px; text - align: center; text - width: 100%; display: inline - block; font - size: 16px"> <option value="">' + "Filter by " + column.header().innerText + '</option></select>').appendTo($(column.footer()).empty())
                        .on('change', function () {
                            debugger
                            var value = $.fn.dataTable.util.escapeRegex($(this).val());
                            column.search(value ? '^' + value + '$' : '', true, false).draw();
                        });

                    column.data().unique().sort().each(function (d, j) {
                        select.append('<option value="' + d + '">' + d + '</option>')
                    })
                }


                else if (columnIdx == 7) {
                    /* Custom filtering function which will filter between a value and max rating */
                    $.fn.dataTable.ext.search.push(
                        function (settings, data, dataIndex) {
                            var min = parseInt($('#rating').val(), 10);
                            var max = parseInt(5, 10);
                            var rating = parseFloat(data[7]) || 0;

                            if ((isNaN(min) && isNaN(max)) ||
                                (isNaN(min) && rating <= max) ||
                                (min <= rating && isNaN(max)) ||
                                (min <= rating && rating <= max)) {
                                return true;
                            }
                            return false;
                        }
                    );


                    var select = $('<select id="rating" style="background-color:lightslategray; border: none; border-radius: 8px;color: white; padding: 15px 32px; text - align: center; text - width: 100%; display: inline - block; font - size: 16px"> <option value="">' + "Filter by " + column.header().innerText + '</option></select>').appendTo($(column.footer()).empty())
                        .on('change', function () {

                            var value = $.fn.dataTable.util.escapeRegex($(this).val());
                            table.draw();
                        });

                    var ratings = [1, 2, 3, 4, 5];
                    for (var i = 0; i < ratings.length; i++) {
                        var rate = ratings[i];
                        select.append('<option value="' + rate + '"> More than ' + rate + ' star' + (rate > 1 ? 's' : '') + '</option>')
                    }

                }

                table.columns.adjust().draw();

            })

        }

    });


});
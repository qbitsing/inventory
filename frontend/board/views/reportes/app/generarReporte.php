<?php

require_once dirname(__FILE__) . '/../Classes/PHPExcel.php';

$excel = new PHPExcel();

$excel->getProperties()->setCreator("Prines S.A.S");

$excel->setActiveSheetIndex(0)
        ->setCellValue('A1', 'Hello')
        ->setCellValue('B2', 'world!')
        ->setCellValue('C1', 'Hello')
        ->setCellValue('D2', 'world!');


$excel->setActiveSheetIndex(0)
              ->setCellValue('A4', 'Miscellaneous glyphs')
              ->setCellValue('A5', 'éàèùâêîôûëïüÿäöüç');


$excel->getActiveSheet()->setCellValue('A8',"Hello\nWorld");
$excel->getActiveSheet()->getRowDimension(8)->setRowHeight(-1);
$excel->getActiveSheet()->getStyle('A8')->getAlignment()->setWrapText(true);


$value = "-ValueA\n-Value B\n-Value C";
$excel->getActiveSheet()->setCellValue('A10', $value);
$excel->getActiveSheet()->getRowDimension(10)->setRowHeight(-1);
$excel->getActiveSheet()->getStyle('A10')->getAlignment()->setWrapText(true);
$excel->getActiveSheet()->getStyle('A10')->setQuotePrefix(true);
// Rename worksheet
echo date('H:i:s') , " Rename worksheet" , EOL;
$excel->getActiveSheet()->setTitle('Simple');
// Set active sheet index to the first sheet, so Excel opens this as the first sheet
$excel->setActiveSheetIndex(0);
// Save Excel 2007 file
echo date('H:i:s') , " Write to Excel2007 format" , EOL;
$callStartTime = microtime(true);
$objWriter = PHPExcel_IOFactory::createWriter($excel, 'Excel2007');
$objWriter->save(str_replace('.php', '.xlsx', __FILE__));
$callEndTime = microtime(true);
$callTime = $callEndTime - $callStartTime;
echo date('H:i:s') , " File written to " , str_replace('.php', '.xlsx', pathinfo(__FILE__, PATHINFO_BASENAME)) , EOL;
echo 'Call time to write Workbook was ' , sprintf('%.4f',$callTime) , " seconds" , EOL;
// Echo memory usage
echo date('H:i:s') , ' Current memory usage: ' , (memory_get_usage(true) / 1024 / 1024) , " MB" , EOL;
// Save Excel 95 file
echo date('H:i:s') , " Write to Excel5 format" , EOL;
$callStartTime = microtime(true);
$objWriter = PHPExcel_IOFactory::createWriter($excel, 'Excel5');
$objWriter->save(str_replace('.php', '.xls', __FILE__));
$callEndTime = microtime(true);
$callTime = $callEndTime - $callStartTime;
echo date('H:i:s') , " File written to " , str_replace('.php', '.xls', pathinfo(__FILE__, PATHINFO_BASENAME)) , EOL;
echo 'Call time to write Workbook was ' , sprintf('%.4f',$callTime) , " seconds" , EOL;
// Echo memory usage
echo date('H:i:s') , ' Current memory usage: ' , (memory_get_usage(true) / 1024 / 1024) , " MB" , EOL;
// Echo memory peak usage
echo date('H:i:s') , " Peak memory usage: " , (memory_get_peak_usage(true) / 1024 / 1024) , " MB" , EOL;
// Echo done
echo date('H:i:s') , " Done writing files" , EOL;
echo 'Files have been created in ' , getcwd() , EOL;



 ?>

<?php

error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);
date_default_timezone_set('Europe/London');

$so = 'Excel5';
if(isset($_GET['so'])) $so = $_GET['so'];

$URL = "http://192.168.128.7:5000/productos/valance";

$peticion = curl_init();

curl_setopt($peticion, CURLOPT_URL, $URL);
curl_setopt($peticion, CURLOPT_HTTPGET, TRUE);
curl_setopt($peticion, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
curl_setopt($peticion, CURLOPT_SSLVERSION, 6);
curl_setopt($peticion, CURLOPT_RETURNTRANSFER, 1);

$respuesta = curl_exec($peticion);
$datos = json_decode ($respuesta);
$productos = $datos->productos;
$total = $datos->total;
$days = array('Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado');
$years = array(
  '',
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
);
$time = time();
$textoFecha = $days[date("N", $time)]." ". date("j", $time)." de ". $years[date("n", $time)] ." de ". date("Y", $time);
$logo = './logo-prines.jpg';

if (PHP_SAPI == 'cli')
	die('This example should only be run from a Web Browser');

require_once dirname(__FILE__) . '/Classes/PHPExcel.php';


$objPHPExcel = new PHPExcel();

$objPHPExcel->getProperties()->setCreator("PRINES - S.A.S")
							 ->setLastModifiedBy("PRINES - S.A.S")
							 ->setTitle("Reporte de inventario PRINES");

$objPHPExcel->setActiveSheetIndex(0)
            ->setCellValue('B1', 'SALDO DE INVENTARIO: '.$textoFecha)
            ->mergeCells('B1:D2')
            ->setCellValue('E1', $total)
            ->mergeCells('E1:F2');

$objDrawing = new PHPExcel_Worksheet_Drawing();
$objDrawing->setName('test_img');
$objDrawing->setDescription('test_img');
$objDrawing->setPath($logo);
$objDrawing->setCoordinates('A1');
$objDrawing->setResizeProportional(false);
$objDrawing->setWidth(60);
$objDrawing->setHeight(35);
$objDrawing->setWorksheet($objPHPExcel->getActiveSheet());
$objPHPExcel->getActiveSheet()
    ->mergeCells('A1:A2');

$objPHPExcel->getActiveSheet()
  ->setCellValue('A4', 'Articulo')
  ->mergeCells('A4:A5')
  ->setCellValue('B4', 'Marca')
  ->mergeCells('B4:B5')
  ->setCellValue('C4','Codificación')
  ->mergeCells('C4:C5')
  ->setCellValue('D4','Saldo')
  ->mergeCells('D4:D5')
  ->setCellValue('E4', 'Valor Unitario')
  ->mergeCells('E4:E5')
  ->setCellValue('F4', 'Valor Total')
  ->mergeCells('F4:F5');

$objPHPExcel->getActiveSheet()
  ->getStyle('A4:F5')
  ->getFill()
  ->applyFromArray(array(
        'type' => PHPExcel_Style_Fill::FILL_SOLID,
        'startcolor' => array('rgb' => 'B7D8FF')
  ));
$estiloContenidoinformacion = array(
    'font' => array(
        'name'  => 'Arial',
        'bold'  => true
    ),'borders' => array(
        'top' => array(
            'style' => PHPExcel_Style_Border::BORDER_THIN ,
            'color' => array(
                'rgb' => '000000'
            )
        ),'bottom' => array(
            'style' => PHPExcel_Style_Border::BORDER_THIN ,
            'color' => array(
                'rgb' => '000000'
            )
        ),'right' => array(
            'style' => PHPExcel_Style_Border::BORDER_THIN ,
            'color' => array(
                'rgb' => '000000'
            )
        )
    ),'alignment' =>  array(
        'horizontal'=> PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
        'vertical'  => PHPExcel_Style_Alignment::VERTICAL_CENTER,
        'wrap'      => TRUE
    ));
$objPHPExcel->getActiveSheet()
  ->getStyle('A4:F5')
  ->applyFromArray($estiloContenidoinformacion);
function generarFila($a, $b, $c, $d, $e, $f, $i, $obj){
  $estiloContenidoinformacion = array(
    'font' => array(
        'name'  => 'Arial',
        'bold'  => false
    ),'borders' => array(
        'top' => array(
            'style' => PHPExcel_Style_Border::BORDER_THIN ,
            'color' => array(
                'rgb' => '000000'
            )
        ),'bottom' => array(
            'style' => PHPExcel_Style_Border::BORDER_THIN ,
            'color' => array(
                'rgb' => '000000'
            )
        ),'right' => array(
            'style' => PHPExcel_Style_Border::BORDER_THIN ,
            'color' => array(
                'rgb' => '000000'
            )
        )
    ),'alignment' =>  array(
        'horizontal'=> PHPExcel_Style_Alignment::HORIZONTAL_LEFT,
        'vertical'  => PHPExcel_Style_Alignment::VERTICAL_CENTER,
        'wrap'      => TRUE
    ));
  $style1 = array(
        'type' => PHPExcel_Style_Fill::FILL_SOLID,
        'startcolor' => array('rgb' => 'B7D8FF')
  );
  $style2 = array(
      'type' => PHPExcel_Style_Fill::FILL_SOLID,
      'startcolor'=> array('rgb'=>'C7CDE1')
  );
  $style;
  $obj->getActiveSheet()
    ->setCellValue('A'.$i, strtoupper($a))
    ->setCellValue('B'.$i, strtoupper($b))
    ->setCellValue('C'.$i, strtoupper($c))
    ->setCellValue('D'.$i, strtoupper($d))
    ->setCellValue('E'.$i, strtoupper($e))
    ->setCellValue('F'.$i, strtoupper($f));
    if(($i%2)== 0) $style = $style2;
    else $style = $style1;
  $obj->getActiveSheet()
    ->getRowDimension($i)
    ->setRowHeight(20);

  $obj->getActiveSheet()
  ->getStyle('A'.$i.':F'.$i)
  ->getFill()
  ->applyFromArray($style);

  $obj->getActiveSheet()
    ->getStyle('A'.$i.':F'.$i)
    ->applyFromArray($estiloContenidoinformacion);
}

for ($i=0; $i < count($productos); $i++) {
  $p = $productos[$i];
  $nombre = '';
  if(isset($p->nombre)) $nombre = $p->nombre;
  $marca = '';
  if(isset($p->marca)) $marca = $p->marca;
  $codigo = '';
  if(isset($p->codigo)) $codigo = $p->codigo;
  $cantidad = '';
  if(isset($p->cantidad)) $cantidad = $p->cantidad;
  $precio = 0;
  if(isset($p->precio)) $precio = $p->precio;
  $precioCalculado = 0;
  if(isset($p->precioCalculado)) $precioCalculado = $p->precioCalculado;

  generarFila(
    $nombre,
    $marca,
    $codigo,
    $cantidad,
    $precio,
    $precioCalculado,
    $i+6,
    $objPHPExcel
  );
}

$objPHPExcel->getActiveSheet()
    ->getColumnDimension('A')
    ->setAutoSize(true);

$objPHPExcel->getActiveSheet()
    ->getColumnDimension('B')
    ->setWidth(13)
    ->setAutoSize(false);

$objPHPExcel->getActiveSheet()
    ->getColumnDimension('C')
    ->setWidth(17)
    ->setAutoSize(false);

$objPHPExcel->getActiveSheet()
    ->getColumnDimension('D')
    ->setWidth(17)
    ->setAutoSize(false);

$objPHPExcel->getActiveSheet()
    ->getColumnDimension('E')
    ->setWidth(17)
    ->setAutoSize(false);

$objPHPExcel->getActiveSheet()
    ->getColumnDimension('F')
    ->setWidth(17)
    ->setAutoSize(false);


$objPHPExcel->getActiveSheet()
    ->setTitle('Balance');

$objPHPExcel->setActiveSheetIndex(0);


header('Content-Type: application/vnd.ms-excel');
header('Content-Disposition: attachment;filename="Balance.xls"');
header('Cache-Control: max-age=0');
header('Cache-Control: max-age=1');

header ('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header ('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT');
header ('Cache-Control: cache, must-revalidate');
header ('Pragma: public');

$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, $so);
$objWriter->save('php://output');
exit;

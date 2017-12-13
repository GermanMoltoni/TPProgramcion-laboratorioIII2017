<?php


require_once './vendor/phpoffice/phpexcel/Classes/PHPExcel.php';
require_once './vendor/phpoffice/phpexcel/Classes/PHPExcel/Writer/Excel2007.php';

class Export{
    public $data;
    public $cabezera;
    public $excel;
    public function __construct($d,$t){
        $this->data = $d;
        $this->titulo = $t;
    }
    
    private function ArmarExcel(){
        $objPHPExcel = new PHPExcel();
        $objPHPExcel->getProperties()->setCreator("Germán Moltoni");
        $objPHPExcel->getProperties()->setTitle($this->titulo);
        $objPHPExcel->getActiveSheet()->setTitle($this->titulo);
        $objPHPExcel->setActiveSheetIndex(0)
            ->setCellValue('A1',$this->titulo); 
        $i=3;
        $sheet = $objPHPExcel->getActiveSheet();
        $sheet->getPageSetup()->setOrientation(PHPExcel_Worksheet_PageSetup::ORIENTATION_LANDSCAPE);
        $arrayHeader= array_map('strtolower', array_keys(get_object_vars($this->data[0])));

        $sheet->fromArray($arrayHeader,null,'A2');
        $style = $sheet->getStyle("A2:".$objPHPExcel->getActiveSheet()->getHighestDataColumn()."2");
        $style->getFont()->setBold(true);
        $style->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
        $style->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID)->getStartColor()->setRGB('8BEAE7');
        foreach($this->data as $key=>$value){
            $sheet->fromArray((array)$value,null,'A'.$i);
            $style = $sheet->getStyle("A$i:".$objPHPExcel->getActiveSheet()->getHighestDataColumn().$i);
            $style->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
            $i++;
        }   
        foreach (range('A', $sheet->getHighestDataColumn()) as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        } 

        $this->excel= $objPHPExcel;
    }
    public function ToExcel($response){
        $this->ArmarExcel();
        $objWriter = new PHPExcel_Writer_Excel2007($this->excel,'Excel2007');
        $nombre = $this->titulo.".xlsx";
        ob_end_clean();
        $objWriter->save('php://output');
        return $response
            ->withHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            ->withHeader('Content-Disposition', 'attachment;filename="'.$nombre.'"')
            ->withHeader('Cache-Control', 'max-age=0')
            ->withHeader('Pragma', 'public');
        //$objWriter->save('./'.$this->titulo.'.xlsx');
    }



    public function ToPDF($response){
        $this->ArmarExcel();
        $rendererName = PHPExcel_Settings::PDF_RENDERER_TCPDF;
        if(!PHPExcel_Settings::setPdfRenderer($rendererName,'./vendor/tecnickcom/tcpdf/')){
            die('Please set the $rendererName and $rendererLibraryPath values' .PHP_EOL .' as appropriate for your directory structure');
        }
        $objWriter = PHPExcel_IOFactory::createWriter($this->excel, 'PDF');
        $objWriter->save('php://output');
        $nombre = $this->titulo.".pdf";
        var_dump($nombre);
        return $response
            ->withHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            ->withHeader('Content-Disposition', 'attachment;filename="'.$nombre.'"')
            ->withHeader('Cache-Control', 'max-age=0')
            ->withHeader('Pragma', 'public');
        //$objWriter->save('./'.$this->titulo.'.pdf');
    }
}
?>
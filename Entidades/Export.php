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
        //$objPHPExcel->setActiveSheetIndex(0)
          //  ->mergeCells('A1:D1') //titulo
            //->setCellValue('A1',$this->titulo); 
        $i=4;
        $objPHPExcel->getActiveSheet()->fromArray(array_keys(get_object_vars($this->data[0])),null,'A3');
        foreach($this->data as $key=>$value){
            $objPHPExcel->getActiveSheet()->fromArray((array)$value,null,'A'.$i);
            $i++;
        }   
foreach (range('A', $objPHPExcel->getActiveSheet()->getHighestDataColumn()) as $col) {
        $objPHPExcel->getActiveSheet()
                ->getColumnDimension($col)
                ->setAutoSize(true);
    } 

        $this->excel= $objPHPExcel;
    }
    public function ToExcel(){
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



    public function ToPDF(){
        $this->ArmarExcel();
        $rendererName = PHPExcel_Settings::PDF_RENDERER_TCPDF;
        if(!PHPExcel_Settings::setPdfRenderer($rendererName,'./vendor/tecnickcom/tcpdf/')){
            die('Please set the $rendererName and $rendererLibraryPath values' .PHP_EOL .' as appropriate for your directory structure');
        }
        $objWriter = PHPExcel_IOFactory::createWriter($this->excel, 'PDF');
        $objWriter->save('php://output');
        $nombre = $this->titulo.".pdf";

        return $response
            ->withHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            ->withHeader('Content-Disposition', 'attachment;filename="'.$nombre.'"')
            ->withHeader('Cache-Control', 'max-age=0')
            ->withHeader('Pragma', 'public');
        //$objWriter->save('./'.$this->titulo.'.pdf');
    }
}
?>
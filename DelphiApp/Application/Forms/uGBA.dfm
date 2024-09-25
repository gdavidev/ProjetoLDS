object formGBA: TformGBA
  Left = 0
  Top = 0
  Align = alClient
  BorderStyle = bsNone
  Caption = 'formGBA'
  ClientHeight = 480
  ClientWidth = 640
  Color = clBtnFace
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -12
  Font.Name = 'Segoe UI'
  Font.Style = []
  OnCreate = FormCreate
  TextHeight = 15
  object pnlPrincipal: TPanel
    Left = 0
    Top = 0
    Width = 640
    Height = 480
    Align = alClient
    Font.Charset = DEFAULT_CHARSET
    Font.Color = clWindowText
    Font.Height = -29
    Font.Name = 'Calibri'
    Font.Style = []
    ParentFont = False
    TabOrder = 0
    object sbPrincipal: TScrollBox
      Left = 1
      Top = 1
      Width = 638
      Height = 478
      Align = alClient
      TabOrder = 1
    end
    object btnVoltar: TButton
      Left = 25
      Top = 25
      Width = 75
      Height = 75
      ImageIndex = 0
      ImageName = 'Voltar'
      Images = vImgListIcones
      TabOrder = 0
      OnClick = btnVoltarClick
    end
  end
  object imgCollectionIcones: TImageCollection
    Images = <
      item
        Name = 'Voltar'
        SourceImages = <
          item
            Image.Data = {
              89504E470D0A1A0A0000000D49484452000000320000003208060000001E3F88
              B1000000097048597300000B1300000B1301009A9C180000009349444154789C
              EDD9B10DC2401404D169E29FA0FF4A8810C82438A01C2CA40B100DB0FF34AF82
              5B8D03FB0C923A18C003B8D07CC40EBC811B4D15F09C235EC089861C91C21229
              2C91C212292C91C212292C91A27C150F512B94F8D8E6887D7EAEB6B5AD32A47E
              1EAD338D956342956542956542956542592695655259269565522D55667CFD9E
              BED3DC987700D77F1F445AD501C974741F2DBBD7D90000000049454E44AE4260
              82}
          end>
      end>
    Left = 101
    Top = 377
  end
  object vImgListIcones: TVirtualImageList
    Images = <
      item
        CollectionIndex = 0
        CollectionName = 'Voltar'
        Name = 'Voltar'
      end>
    ImageCollection = imgCollectionIcones
    Width = 64
    Height = 64
    Left = 109
    Top = 305
  end
  object ImageList: TImageList
    Height = 96
    Width = 96
    Left = 385
    Top = 257
  end
end

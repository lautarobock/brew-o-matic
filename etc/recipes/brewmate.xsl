<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl"
>
  <xsl:output method="html" indent="yes"/>
  <xsl:template match="/RECIPES">  
    <html>
      <head>
        <title>
          BrewMate Recipe
        </title>        
      </head>
      <body>
        <xsl:for-each select ="RECIPE">
        <table border="0" cellspacing="0" cellpadding="0">
      <tr>
                <td width="450">
				<h1> <b><xsl:value-of select="NAME"/></b> </h1>
          <h2><xsl:value-of select="STYLE/NAME"/></h2>
		  <xsl:if test="BREWER != 'BrewMate'">
          Recipe by <xsl:value-of select="BREWER"/> 
		  </xsl:if>

          </td> 
          
        <xsl:if test="CALCCOLOUR >= '0'">
		<xsl:if test="CALCCOLOUR &lt; '1'">
        <td ><img src="http://www.brewmate.net/BeerGlass/BeerGlass_0.gif" width="120" height="150" /></td>
		</xsl:if>
        </xsl:if>         
      
        <xsl:if test="CALCCOLOUR >= '1'">
		<xsl:if test="CALCCOLOUR &lt; '2'">
          <td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_1.gif" width="120" height="150" /></td>
		</xsl:if>
        </xsl:if>

	    <xsl:if test="CALCCOLOUR >= '2'">
		<xsl:if test="CALCCOLOUR &lt; '3'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_2.gif" width="120" height="150" /></td>
        </xsl:if>
		</xsl:if>
		
		<xsl:if test="CALCCOLOUR >= '3'">
		<xsl:if test="CALCCOLOUR &lt; '4'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_3.gif" width="120" height="150" /></td>
        </xsl:if>
		 </xsl:if>
		
		<xsl:if test="CALCCOLOUR >= '4'">
		<xsl:if test="CALCCOLOUR &lt; '5'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_4.gif" width="120" height="150" /></td>
        </xsl:if>
		</xsl:if>

		<xsl:if test="CALCCOLOUR >= '5'">
		<xsl:if test="CALCCOLOUR &lt; '6'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_5.gif" width="120" height="150" /></td>
        </xsl:if>
		</xsl:if>
		
		<xsl:if test="CALCCOLOUR >= '6'">
		<xsl:if test="CALCCOLOUR &lt; '7'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_6.gif" width="120" height="150" /></td>
        </xsl:if>
		 </xsl:if>
		
		<xsl:if test="CALCCOLOUR >= '7'">
		<xsl:if test="CALCCOLOUR &lt; '8'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_7.gif" width="120" height="150" /></td>
        </xsl:if>
		 </xsl:if>
		
		<xsl:if test="CALCCOLOUR >= '8'">
		<xsl:if test="CALCCOLOUR &lt; '9'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_8.gif" width="120" height="150" /></td>
        </xsl:if>
		 </xsl:if>
		
		<xsl:if test="CALCCOLOUR >= '9'">
		<xsl:if test="CALCCOLOUR &lt; '10'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_9.gif" width="120" height="150" /></td>
        </xsl:if>
		 </xsl:if>
		
		<xsl:if test="CALCCOLOUR >= '10'">
        <xsl:if test="CALCCOLOUR &lt; '11'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_10.gif" width="120" height="150" /></td>
        </xsl:if>
        </xsl:if>	
        
      
        <xsl:if test="CALCCOLOUR >= '11'">
		<xsl:if test="CALCCOLOUR &lt; '12'">
          <td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_11.gif" width="120" height="150" /></td>
		</xsl:if>
        </xsl:if>

	    <xsl:if test="CALCCOLOUR >= '12'">
		<xsl:if test="CALCCOLOUR &lt; '13'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_12.gif" width="120" height="150" /></td>
        </xsl:if>
		</xsl:if>
		
		<xsl:if test="CALCCOLOUR >= '13'">
		<xsl:if test="CALCCOLOUR &lt; '14'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_13.gif" width="120" height="150" /></td>
        </xsl:if>
		 </xsl:if>
		
		<xsl:if test="CALCCOLOUR >= '14'">
		<xsl:if test="CALCCOLOUR &lt; '15'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_14.gif" width="120" height="150" /></td>
        </xsl:if>
		</xsl:if>

		<xsl:if test="CALCCOLOUR >= '15'">
		<xsl:if test="CALCCOLOUR &lt; '16'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_15.gif" width="120" height="150" /></td>
        </xsl:if>
		</xsl:if>
		
		<xsl:if test="CALCCOLOUR >= '16'">
		<xsl:if test="CALCCOLOUR &lt; '17'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_16.gif" width="120" height="150" /></td>
        </xsl:if>
		 </xsl:if>
		
		<xsl:if test="CALCCOLOUR >= '17'">
		<xsl:if test="CALCCOLOUR &lt; '18'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_17.gif" width="120" height="150" /></td>
        </xsl:if>
		 </xsl:if>
		
		<xsl:if test="CALCCOLOUR >= '18'">
		<xsl:if test="CALCCOLOUR &lt; '19'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_18.gif" width="120" height="150" /></td>
        </xsl:if>
		 </xsl:if>
		
		<xsl:if test="CALCCOLOUR >= '19'">
		<xsl:if test="CALCCOLOUR &lt; '20'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_19.gif" width="120" height="150" /></td>
        </xsl:if>
		 </xsl:if>
		
		<xsl:if test="CALCCOLOUR >= '20'">
        <xsl:if test="CALCCOLOUR &lt; '21'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_20.gif" width="120" height="150" /></td>
        </xsl:if>
        </xsl:if>
        
       
        <xsl:if test="CALCCOLOUR >= '21'">
		<xsl:if test="CALCCOLOUR &lt; '22'">
          <td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_21.gif" width="120" height="150" /></td>
		</xsl:if>
        </xsl:if>

	    <xsl:if test="CALCCOLOUR >= '22'">
		<xsl:if test="CALCCOLOUR &lt; '23'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_22.gif" width="120" height="150" /></td>
        </xsl:if>
		</xsl:if>
		
		<xsl:if test="CALCCOLOUR >= '23'">
		<xsl:if test="CALCCOLOUR &lt; '24'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_23.gif" width="120" height="150" /></td>
        </xsl:if>
		 </xsl:if>
		
		<xsl:if test="CALCCOLOUR >= '24'">
		<xsl:if test="CALCCOLOUR &lt; '25'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_24.gif" width="120" height="150" /></td>
        </xsl:if>
		</xsl:if>

		<xsl:if test="CALCCOLOUR >= '25'">
		<xsl:if test="CALCCOLOUR &lt; '26'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_25.gif" width="120" height="150" /></td>
        </xsl:if>
		</xsl:if>
		
		<xsl:if test="CALCCOLOUR >= '26'">
		<xsl:if test="CALCCOLOUR &lt; '27'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_26.gif" width="120" height="150" /></td>
        </xsl:if>
		 </xsl:if>
		
		<xsl:if test="CALCCOLOUR >= '27'">
		<xsl:if test="CALCCOLOUR &lt; '28'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_27.gif" width="120" height="150" /></td>
        </xsl:if>
		 </xsl:if>
		
		<xsl:if test="CALCCOLOUR >= '28'">
		<xsl:if test="CALCCOLOUR &lt; '29'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_28.gif" width="120" height="150" /></td>
        </xsl:if>
		 </xsl:if>
		
		<xsl:if test="CALCCOLOUR >= '29'">
		<xsl:if test="CALCCOLOUR &lt; '30'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_29.gif" width="120" height="150" /></td>
        </xsl:if>
		 </xsl:if>
		
		<xsl:if test="CALCCOLOUR >= '30'">
        <xsl:if test="CALCCOLOUR &lt; '31'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_30.gif" width="120" height="150" /></td>
        </xsl:if>
        </xsl:if>	
        
      
        <xsl:if test="CALCCOLOUR >= '31'">
		<xsl:if test="CALCCOLOUR &lt; '32'">
          <td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_31.gif" width="120" height="150" /></td>
		</xsl:if>
        </xsl:if>

	    <xsl:if test="CALCCOLOUR >= '32'">
		<xsl:if test="CALCCOLOUR &lt; '33'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_32.gif" width="120" height="150" /></td>
        </xsl:if>
		</xsl:if>
		
		<xsl:if test="CALCCOLOUR >= '33'">
		<xsl:if test="CALCCOLOUR &lt; '34'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_33.gif" width="120" height="150" /></td>
        </xsl:if>
		 </xsl:if>
		
		<xsl:if test="CALCCOLOUR >= '34'">
		<xsl:if test="CALCCOLOUR &lt; '35'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_34.gif" width="120" height="150" /></td>
        </xsl:if>
		</xsl:if>

		<xsl:if test="CALCCOLOUR >= '35'">
		<xsl:if test="CALCCOLOUR &lt; '36'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_35.gif" width="120" height="150" /></td>
        </xsl:if>
		</xsl:if>
		
		<xsl:if test="CALCCOLOUR >= '36'">
		<xsl:if test="CALCCOLOUR &lt; '37'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_36.gif" width="120" height="150" /></td>
        </xsl:if>
		 </xsl:if>
		
		<xsl:if test="CALCCOLOUR >= '37'">
		<xsl:if test="CALCCOLOUR &lt; '38'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_37.gif" width="120" height="150" /></td>
        </xsl:if>
		 </xsl:if>
		
		<xsl:if test="CALCCOLOUR >= '38'">
		<xsl:if test="CALCCOLOUR &lt; '39'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_38.gif" width="120" height="150" /></td>
        </xsl:if>
		 </xsl:if>
		
		<xsl:if test="CALCCOLOUR >= '39'">
		<xsl:if test="CALCCOLOUR &lt; '40'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_39.gif" width="120" height="150" /></td>
        </xsl:if>
		 </xsl:if>
		
		<xsl:if test="CALCCOLOUR >= '40'">
		<td><img src="http://www.brewmate.net/BeerGlass/BeerGlass_40.gif" width="120" height="150" /></td>
        </xsl:if>
      
       </tr>
       </table>
<hr />
                  <span style="font-weight:bold">Recipe Specs</span><BR />


          <table width="600" border="0">
            <tr style="background-color:#D3D3D3">
              <td width="110">Original Gravity</td>
              <td width="110">Final Gravity</td>
               <td width="140"><p>Colour (SRM / EBC)</p>               </td>
              <td width="110">Bitterness</td>
              <td width="130">Alcohol by Volume</td>
              </tr>

              <tr>
                <td>
                  <xsl:value-of select="format-number((OG), '0.000')" />                </td>
                <td>
                 <xsl:value-of select="format-number((FG), '0.000')" />                </td>
                  <td>
                 <xsl:value-of select="format-number((CALCCOLOUR), '0.0')" />
/
                 <xsl:value-of select="format-number((CALCCOLOUR*1.97), '0.0')" />                </td>
                <td>
                  <xsl:value-of select="format-number((CALCIBU), '0.0')" /> IBU                </td>
                
                 <td>
                  <xsl:value-of select="format-number((((((OG)-(FG))*1000)*0.13) div 100), '0.0%')" />  
                 </td>
            </tr>
          </table>
               
                                  
   <BR />
                   <span style="font-weight:bold">Brewhouse Specs</span><BR />
          <table width="600" border="0">
            <tr style="background-color:#D3D3D3">
                       <td width="150">Recipe Type</td>
                       <td width="150">Batch Size</td>
                       <td width="150">Boil Time</td>
                       <td width="150">Efficiency</td>
                     </tr>
                     <tr>
                       <td><xsl:value-of select="TYPE"/></td>
                       <td><xsl:value-of select="format-number((BATCH_SIZE), '0.0 Litres')" /> / <xsl:value-of select="format-number(((BATCH_SIZE)* 0.264172052), '0.0 Gal')" /></td>
                       <td><xsl:value-of select="format-number((BOIL_TIME), '0.0 min')" /> </td>
                       <td><xsl:value-of select="format-number(EFFICIENCY div 100,'0.0%')" /> </td>
                     </tr>
                   </table>
                   <BR />
                   <span style="font-weight:bold">Fermentables</span><BR />
          <table width="600" border="0">
            <tr style="background-color:#D3D3D3">
              <td width="300">Name</td>
              <td width="50">Type</td>
              <td width="50">SRM</td>
              <td width="50">Percentage</td>
              <td width="150">Amount</td>
            </tr>

            <xsl:for-each select ="FERMENTABLES/FERMENTABLE">
              <tr>
                <td>
                  <xsl:value-of select="NAME"/>                </td>
                <td><xsl:value-of select="TYPE"/></td>
                <td>
                   <xsl:value-of select="format-number(COLOR,'0.0')"/>                </td>
                  <td>
                  <xsl:value-of select="format-number(PERCENTAGE div 100,'0.00 %')"/>                </td>
                <td>
                  <xsl:value-of select="format-number(AMOUNT,'0.00 Kg')"/> / <xsl:value-of select="format-number((AMOUNT) div  0.45359237,'0.00 Lbs')"/>                </td>
              </tr>
            </xsl:for-each>
          </table>

          <br />
          <span style="font-weight:bold">Hops</span>
          <table width="600" border="0">
            <tr style="background-color:#D3D3D3">
              <td width="225">Name</td>
              <td width="50">AA%</td>
              <td width="150">Amount</td>
              <td width="75">Use</td>
              <td width="50">Time</td>
            </tr>
            <xsl:for-each select="HOPS/HOP" >
              <tr>
                <td>
                  <xsl:value-of select="NAME"/>                </td>
                <td>
                  <xsl:value-of select="format-number(ALPHA div 100, '0.0%')"/>                </td>
                <td>
                  <xsl:value-of select="format-number((AMOUNT)*1000, '0.00 g')"/> / <xsl:value-of select="format-number((AMOUNT)* 35.2739619, '0.00 oz')"/>                </td>
                <td>
                  <xsl:value-of select="USE"/>                </td>
                <td>
				 <xsl:if test="TIME >= '1440'">
				 <xsl:value-of select="format-number((TIME) div 60 div 24 , '0 days')"/>
		         </xsl:if>
				 <xsl:if test="TIME &lt; '1440'">
                 <xsl:value-of select="TIME"/> mins
		         </xsl:if>
				 </td>
              </tr>
            </xsl:for-each>
          </table>
          <br />
          <span style="font-weight:bold">Misc</span>
          <table width="600" border="0">
            <tr style="background-color:#D3D3D3">
              <td width="350">Name</td>
              <td width="150">Amount</td>
              <td width="50">Use</td>
              <td width="50">Time</td>
            </tr>
            <xsl:for-each select="MISCS/MISC">
              <tr>
                <td>
                  <xsl:value-of select="NAME"/>                </td>
                <td>
                      <xsl:value-of select="format-number((AMOUNT)*1000, '0.00')"/> g / <xsl:value-of select="format-number((AMOUNT)* 35.2739619, '0.00')"/> oz</td>            

                <td>
                  <xsl:value-of select="USE"/>                </td>
                
                <td>
                   <xsl:if test="TIME >= '1440'">
				 <xsl:value-of select="format-number((TIME) div 60 div 24 , '0 days')"/>
		         </xsl:if>
				 <xsl:if test="TIME &lt; '1440'">
                 <xsl:value-of select="TIME"/> mins
		         </xsl:if>
				 </td>
              </tr>
            </xsl:for-each> 
          </table>
          <br />
          <span style="font-weight:bold">Yeast</span>
          <table width="600" border="0">
            <tr style="background-color:#D3D3D3">
              <td width="550">Name</td>
              <td width="50">Attenuation</td>
            </tr>
            <xsl:for-each select="YEASTS/YEAST" >
              <tr>
                <td>
                  <xsl:value-of select="NAME"/>                </td>
                <td><xsl:value-of select="ATTENUATION"/> %</td>
              </tr>
            </xsl:for-each>
          </table>
          <br />
          <span style="font-weight:bold">Mash Steps</span>
          <table width="600" border="0">
            <tr style="background-color:#D3D3D3">
              <td width="300">Step Name</td>
              <td width="100">Time</td>
              <td width="150">Temperature</td>
              <Td width="50">Type</Td>
            </tr>
            <xsl:for-each select ="MASH/MASH_STEPS/MASH_STEP">
              <tr>
                <td>
                  <xsl:value-of select="NAME"/>                </td>
                <td>
                  <xsl:value-of select="format-number(STEP_TIME,'0.0')"/> min                </td>
                <td>
                  <xsl:value-of select="format-number((STEP_TEMP),'0.0')"/> °C / <xsl:value-of select="format-number(((STEP_TEMP)* 1.8 + 32),'0.0')"/> °F</td>
                <td>
                  <xsl:value-of select="TYPE"/>                </td>
              </tr>
            </xsl:for-each>
            </table>
          <br />
          <span style="font-weight:bold">Notes</span>
          <table width="600" border="0">
            <tr>
          <td>
            <p><xsl:value-of select="NOTES"/></p></td>
          </tr>
          </table>
        </xsl:for-each>

        <p>Recipe Generated with <a href="http://www.brewmate.net/">BrewMate</a></p>
      </body>
    </html>
    
  </xsl:template>
</xsl:stylesheet>

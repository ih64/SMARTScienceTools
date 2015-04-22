#!/opt/anaconda/bin/python
import numpy as np 
import json
from astropy.table import Table, Column

names=["JD_start", "B_JD_start", "Bmag", "Berr", "V_JD_start", "Vmag", "Verr",
	"R_JD_start", "Rmag", "Rerr", "J_JD_start", "Jmag", "Jerr", "K_JD_start", "Kmag", "Kerr"]

tabpath='/var/www/html/smarts/glast/tables/'
glastpath='/var/www/html/smarts/glast/'

def asciiToVOT(tabfile):
	#grab the blazar name
	blazar_id=tabfile.split('.')[0]
	#define the column names
	t=Table.read(tabpath+tabfile, format='ascii', names=names)
	t.write(glastpath+blazar_id+".vot", format='votable', table_id="photometry", overwrite=True)
	return

def asciiToTSV(tabfile):
	#grab the blazar name
	blazar_id=tabfile.split('.')[0]
	t=Table.read(tabpath+tabfile, format='ascii', names=names)
	t.write(glastpath+blazar_id+".tsv", format='ascii.tab')
	return

def asciiToCSV(tabfile):
	#grab the blazar name
	blazar_id=tabfile.split('.')[0]
	t=Table.read(tabpath+tabfile, format='ascii', names=names)
	t.write(glastpath+blazar_id+".csv", format='ascii.csv')
	return

#remove the 999's from an array, make it a list, and replace with None
def cleandata(dataArray):
	datalist=dataArray.tolist()
	index=[i for i, x in enumerate(datalist) if x ==999.]
	for i in index:
		datalist[i]=None
	return datalist

#load up the photometry from all wavelengths into numpy arrays
#input: the blazar's name-AS A STRING
#output: A list of 5 arrays. Each holds photometry of a band
#use the blazar.tab file, this is the public one
#and doesnt have INV data
def getdata(tabfile):
	path='/var/www/html/smarts/glast/tables/'
	time=np.loadtxt(path+tabfile, usecols=(0,), unpack=True)
	bdat = np.loadtxt(path+tabfile, usecols=(1,2,3), unpack=True)
	Bdat=[cleandata(i) for i in bdat]
	vdat = np.loadtxt(path+tabfile, usecols=(4,5,6), unpack=True)
	Vdat=[cleandata(i) for i in vdat]
	rdat = np.loadtxt(path+tabfile, usecols=(7,8,9), unpack=True)
	Rdat=[cleandata(i) for i in rdat]
	jdat = np.loadtxt(path+tabfile, usecols=(10,11,12), unpack=True)
	Jdat=[cleandata(i) for i in jdat]
	kdat = np.loadtxt(path+tabfile, usecols=(13,14,15), unpack=True)
	Kdat=[cleandata(i) for i in kdat]
	data={"time":time.tolist(), "Btime":Bdat[0], "Bmag":Bdat[1], "Berr":Bdat[2],
		"Vtime":Vdat[0], "Vmag":Vdat[1], "Verr":Vdat[2],
		"Rtime":Rdat[0], "Rmag":Rdat[1], "Rerr":Rdat[2],
		"Jtime":Jdat[0], "Jmag":Jdat[1], "Jerr":Jdat[2],
		"Ktime":Kdat[0], "Kmag":Kdat[1], "Kerr":Kdat[2]}
	
	with open (path+tabfile.split('.')[0]+".json",'w') as f:
		json.dump(data,f)
	return

#load up the photometry from all wavelengths into numpy arrays
#input: the blazar's name-AS A STRING
#output: A list of 5 arrays. Each holds photometry of a band
#use the blazar.tab file, this is the public one
#and doesnt have INV data
'''
def getdata(tabfile):
	path='/var/www/html/smarts/glast/tables/'
	time=np.loadtxt(tabfile, usecols=(0,), unpack=True)
	bdat = np.loadtxt(tabfile, usecols=(1,2,3), unpack=True)
	Bdat=[cleandata(i) for i in bdat]
	vdat = np.loadtxt(tabfile, usecols=(4,5,6), unpack=True)
	Vdat=[cleandata(i) for i in vdat]
	rdat = np.loadtxt(tabfile, usecols=(7,8,9), unpack=True)
	Rdat=[cleandata(i) for i in rdat]
	jdat = np.loadtxt(tabfile, usecols=(10,11,12), unpack=True)
	Jdat=[cleandata(i) for i in jdat]
	kdat = np.loadtxt(tabfile, usecols=(13,14,15), unpack=True)
	Kdat=[cleandata(i) for i in kdat]
	data={"time":time.tolist(), "Btime":Bdat[0], "Bmag":Bdat[1], "Berr":Bdat[2],
		"Vtime":Vdat[0], "Vmag":Vdat[1], "Verr":Vdat[2],
		"Rtime":Rdat[0], "Rmag":Rdat[1], "Rerr":Rdat[2],
		"Jtime":Jdat[0], "Jmag":Jdat[1], "Jerr":Jdat[2],
		"Ktime":Kdat[0], "Kmag":Kdat[1], "Kerr":Kdat[2]}
	
	with open (path+tabfile.split('.')[0]+".json",'w') as f:
		json.dump(data,f)
	return
'''
def tabdelim(tabfile):
	path='/var/www/html/smarts/glast/tables/'
	tab=np.loadtxt(path+tabfile)
	tab[tab==999.0]=np.nan
	header="JDstart\tbdate\tbmag\tbmagerr\tvdate\tvmag\tverr\trdate\trmag\trerr\tjdate\tjmag\tjerr\tkdate\tkmag\tkerr"
	np.savetxt(open(path+tabfile.split('.')[0]+'.tsv','w'),tab,header=header,fmt='%.3f',delimiter='\t')
	return

def commadelim(tabfile):
	path='/var/www/html/smarts/glast/tables/'
	tab=np.loadtxt(path+tabfile)
	tab[tab==999.0]=np.nan
	header="JDstart,bdate,bmag,bmagerr,vdate,vmag,verr,rdate,rmag,rerr,jdate,jmag,jerr,kdate,kmag,kerr"
	np.savetxt(open(path+tabfile.split('.')[0]+'.csv','w'),tab,header=header,fmt='%.3f',delimiter=',')
	return	

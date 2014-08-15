import urllib2
from astropy.io import ascii 
import matplotlib.pyplot as plt 

phonebook=['0017-0512', '0035-252', '0135-247', '0208-512', 
'0235+164', '0235-618', '0238-3116', '0250-225', '0301-243', 
'0316+0904', '0402-362', '0413-5332', '0422+004', '0426-380', 
'0454-234', '0454-46', '0458-02', '0502+049', '0507-6104', '0528+134', 
'0531-4827', '0537-441', '0630-2406', '0637-75', '0727-11', '0816-1311', 
'0818-128', '0850-1213', '1004-217', '1059-1134', '1124-186', '1127-14', 
'1144-379', '1212+078', '1244-255', '1329-049', '1335-127', '1406-076', 
'1424-41', '1508-05', '1510-089', '1514-241', '1550-242', '1610-6649', 
'1622-297', '1717-5156', '1730-130', '1749+096', '1913-3630', '1921-1607', 
'1954-388', '1958-179', '2052-474', '2055-002', '2142-75', '2149-306', 
'2155-304', '2227-08', '2232-488', '2233-148', '2240-260', '2255-282', 
'2322-409', '2326-502', '2331-2148', '2345-1555', '2345-16', '2356-309', 
'3C273', '3C279', '3C446', '3C454', 'OJ287']

class blazar(object):
	def __init__(self, target):
		self.target = target
	def doiexist(self):
		if self.target in phonebook:
			print 'Yes, this target is available'
		else:
			print 'Sorry, this target is not available'
		return
	def rollcall(self):
		for i in phonebook:
			print i
		return
	def getdata(self):
		url='http://www.astro.yale.edu/smarts/glast/tables/'
		tablepath=url+self.target+'.csv'
		try:
			req=urllib2.Request(tablepath)
			response = urllib2.urlopen(req)
			data=response.read().splitlines()
			return ascii.read(data,delimiter=',')
		except urllib2.HTTPError as e:
			print 'Error code: ', e.reason
			print 'This target may not exist. Please check your spelling'
			print 'You can use object doiexist() to see if it exists'
			print 'You can also use object rollcall() to print all available targets'
			return
		except urllib2.URLError as e:
			print 'Unable to reach a server'
			print 'Reason: ', e.reason
			return
	def lightcurve(self,data,filters=['b','v','r','j','k']):
		if isinstance(filters, (list, tuple,str)) == False:
			print 'filters must be list, tuple, or single string'
			return
		for i in filters:
			if i.lower() !='b' and i.lower() !='v' and i.lower() !='r' and i.lower() !='j' and i.lower() !='k':
				print str(i)+' is not a recognized filter. please limit your input to "b", "v", "r", "j", or "k"'
				return
		numplots=len(filters)
		plt.figure(1, figsize=(10,8))
		plt.title(self.target+' Light Curve')
		for i in range(0,numplots):
			plt.subplot(numplots,1,i+1)
			plt.subplots_adjust(hspace = .2,top=.95,bottom=.08,left=.05,right=.95)
			timekey=filters[i].lower()+'date'
			datakey=filters[i].lower()+'mag'
			plt.plot(data[timekey],data[datakey],'ro')
			plt.legend(filters[i].upper())
			plt.ylim(plt.ylim()[::-1])
			if i==numplots-1:
				plt.xlabel('Julian Date')
		plt.show()
		return
	def cmd(self,data,blue='b',red='j'):
		filters=['b','v','r','j','k']
		if blue.lower() in filters and red.lower() in filters:
			redkey=red+'mag'
			bluekey=blue+'mag'
			bminusr=data[bluekey]-data[redkey]
			f=plt.figure(figsize=(10,8))
			ax= f.add_subplot(111)
			ax.axes.invert_xaxis()
			ax.set_xlabel(red.upper())
			ax.set_ylabel(blue.upper()+'-'+red.upper())
			ax.set_title(self.target+' Color Magnitude Diagram')
			p=ax.scatter(data[redkey],bminusr,c=data['JDstart'])
			f.colorbar(p)
			plt.show()
			return
		else:
			print 'please use "b", "v", "r", "j", or "k" for the blue and red keywords'
			return


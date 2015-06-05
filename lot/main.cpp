/* This is a standalone program. Pass an image name as the first parameter
of the program.  Switch between standard and probabilistic Hough transform
by changing "#if 1" to "#if 0" and back */
#include "opencv2/highgui/highgui.hpp"
#include "opencv2/imgproc/imgproc.hpp"
#include "opencv2/objdetect/objdetect.hpp"
#include <cv.h>
#include <math.h>
#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include <algorithm>

using namespace cv;
using namespace std;

bool cmp(Point a,Point b)
{
	return a.y<b.y;
}

//int main(int argc, char* argv[])
int main()
{
    Mat src, dst, color_dst,src2;
#if 0
	src=imread(argv[1], 1);//檔案路徑
	src2=imread(argv[1], 1);
	String sender_id = argv[2];
#else
    //src=imread("I:\\image\\11_.jpg", 1);
	//src2=imread("I:\\image\\11_.jpg", 1);
	src=imread("pic_1.jpg", 1);
	src2=imread("pic_1.jpg", 1);
#endif
	//---SIX---src=imread("C:\\Users\\IMSLab\\Dropbox\\CVGIP2014\\test_pic\\DEMO\\imag0027.JPG", 1);
	//---SIX---src2=imread("C:\\Users\\IMSLab\\Dropbox\\CVGIP2014\\test_pic\\DEMO\\imag0027.JPG", 1);
	int colm=src.cols;
	int rows=src.rows;
	
	Mat cut = src(Rect(colm/3, rows/2, colm/3*2, rows/2)); // a 100px x 100px crop //x、y、width、height
	Mat cut2 = cut;
	Mat cut3 = src2(Rect(colm/3, rows/2, colm/3*2, rows/2));;
	
	//---SIX---Mat cut = src(Rect(0, rows/3, colm, rows/3*2)); // a 100px x 100px crop //x、y、width、height
	//---SIX---Mat cut2 = cut;
	//---SIX---Mat cut3 = src2(Rect(0, rows/3, colm, rows/3*2));;
	//cout << "col : " << colm/2 << " , row : " << rows/2 << endl;
	
	namedWindow( "orig", 1 );
    imshow( "orig", cut );

	vector<Mat> rgbChannels(3);
    split(cut, rgbChannels);
	
	Mat_<Vec3b>::iterator it = cut.begin<Vec3b>();  
	Mat_<Vec3b>::iterator itend = cut.end<Vec3b>();
	
	//YUV
	double cb, cr, y;
	for (it; it!=itend; it++)  
	{  
		y = 0.299*(*it)[2] + 0.587*(*it)[1]+ 0.144*(*it)[0];
        cb = (((*it)[2]*(-38) - (*it)[1]*74 + (*it)[0]*112) + 128)/256 + 128;
        cr = (((*it)[2]*112 - (*it)[1]*94 - (*it)[0]*18) + 128)/256 + 128;

		if (y >= 140 && cb >= 0 && cr >= 0)	
		{
			(*it)[0]=255;
			(*it)[1]=255;
			(*it)[2]=255;
		}
		else
		{
			(*it)[0]=0;
			(*it)[1]=0;
			(*it)[2]=0;
		}
	}

    Canny( cut, dst, 50, 200, 3 );//edge detect
    cvtColor( dst, color_dst, CV_GRAY2BGR );

	IplImage *color_dst4= new IplImage(cut);
	//		color_dst4 = &IplImage(cut);
		cvSaveImage("debug2.jpg",color_dst4);
	//namedWindow( "gray", 1 );
    //imshow( "gray", color_dst );

#if 1
	vector<Vec2f> lines;
	HoughLines( dst, lines, 1, CV_PI/180, 95);
	
	int horizontal_line = 0;//有幾條(近似)水平線
	//double horizontal_line_sum = 0;
	//double horizontal_line_avg = 0;
	int park_line = 0; //有幾條是停車格邊緣線
	//double park_line_sum = 0;//所有停車格邊緣線slope絕對值總合
	//double park_line_avg = 0;//所有停車格邊緣線slope絕對值平均*(-1)
	double park_line_a = 0;
	double park_line_b = 0;
	int vertical_line = 0;//有幾條直線
	double cc = 0 ;//斜率絕對值
	//vector<Point> park_line_point1;//存所有pt1 停車邊緣線起始點
	//vector<Point> park_line_point2;//存所有pt2 停車邊緣線終結點
	double park_pt1_sum_x = 0,  park_pt1_sum_y = 0, park_pt2_sum_x = 0, park_pt2_sum_y = 0;//停車邊緣線的起始和終結點x,y的和
	//double hori_pt1_sum_x = 0,  hori_pt1_sum_y = 0, hori_pt2_sum_x = 0, hori_pt2_sum_y = 0;//停車邊緣線的起始和終結點x,y的和
	vector<double> hori_line_a;//存線方程式係數a
	vector<double> hori_line_b;//存線方程式係數b
	double a = 0;
	double b = 0;
	//double pt1_x = 0, pt1_y = 0, pt2_x = 0, pt2_y = 0;
	Point park_pt1, park_pt2;////停車邊緣線的起始和終結點平均後找到的兩點

    for( size_t i = 0; i < lines.size(); i++ )
    {
        float rho = lines[i][0];//distance 
        float theta = lines[i][1];//角度
        double a = cos(theta), b = sin(theta), c = tan(theta); //c:斜率
        double x0 = a*rho, y0 = b*rho;//(x0,y0)
        Point pt1(cvRound(x0 + 1000*(-b)), cvRound(y0 + 1000*(a))); //pt1.x,pt1.y
        Point pt2(cvRound(x0 - 1000*(-b)), cvRound(y0 - 1000*(a))); //pt2.x,pt2.y
		
		//if(i==0){
		//line( color_dst, pt1, pt2, Scalar(0,255,0), 3, 8 );//}
		//cout << c << endl;
		cc = abs(c);

		if(cc==0)
		{
			 vertical_line++;
			 //line( color_dst, pt1, pt2, Scalar(255,0,0), 3, 8 );
		}
		else if(cc>5)//接近水平線
		{	
			
			int roro = rows/3-5;
			if(pt1.y<=45 && pt2.y<=45)//太上面的線
				continue;
			else if(pt1.y>=roro && pt2.y>=roro)////太下面的線
				continue;
			else
			{
				//line( color_dst, pt1, pt2, Scalar(0,255,0), 1, 8 );
				horizontal_line++;
				//cout << pt1 << " " << pt2 << " " << c  << " " << (pt1.y+pt2.y)/2 << endl;
				//if(horizontal_line == 8 || horizontal_line == 9)

				a = (pt1.y-pt2.y) / (pt1.x-pt2.x);
				b = pt2.y - (pt2.x*(pt1.y-pt2.y) / (pt1.x-pt2.x));
				hori_line_a.push_back(a);
				hori_line_b.push_back(b);
				
			}
		}
		else
		{
			//park_line_sum = park_line_sum + cc;
			park_line++;

			//park_line_point1.push_back(pt1);
			//park_line_point2.push_back(pt2);

			park_pt1_sum_x = park_pt1_sum_x + pt1.x;
			park_pt1_sum_y = park_pt1_sum_y + pt1.y;
			park_pt2_sum_x = park_pt2_sum_x + pt2.x;
			park_pt2_sum_y = park_pt2_sum_y + pt2.y;

			//line( color_dst, pt1, pt2, Scalar(0,0,255), 3, 8 );
			//cout << pt1 << " " << pt2 << endl;
		}
    }
	IplImage *color_dst3= new IplImage(color_dst);
				//color_dst3 = &IplImage(color_dst);
		cvSaveImage("debug.jpg",color_dst3);
	//cout << endl << lines.size() << endl;
	//cout << park_line_point1.size() << " " << park_line_point2.size() << endl;
	//cout << vertical_line << " " << horizontal_line << " " << park_line << endl;
	//horizontal_line_avg = horizontal_line_sum/horizontal_line;
	//cout << endl;
	//park_line_avg = (-1)*park_line_sum/park_line;
	//cout << "park_line_avg_slope: " << park_line_avg << endl;
	park_pt1.x = park_pt1_sum_x/park_line;
	park_pt1.y = park_pt1_sum_y/park_line;
	park_pt2.x = park_pt2_sum_x/park_line;
	park_pt2.y = park_pt2_sum_y/park_line;
	//cout << "park_line_avg_2point : " << park_pt1 << " " << park_pt2 << endl;
	park_line_a =(double) (park_pt1.y-park_pt2.y) / (double)(park_pt1.x-park_pt2.x);
	park_line_b = (double)park_pt2.y - (double)(park_pt2.x*(park_pt1.y-park_pt2.y) / (double)(park_pt1.x-park_pt2.x));
	line( color_dst, park_pt1, park_pt2, Scalar(0,0,255), 3, 8 );//red:park_line
	//cout << park_line_a <<" "<< park_line_b<< endl;

	vector<Point> intersect_point;
	Point i_point;
	for(int i=0;i<horizontal_line;i++)
	{
		i_point.x = (double)(hori_line_b[i] - park_line_b) / (double)(park_line_a - hori_line_a[i]);
		i_point.y = (double)park_line_a*(double)(hori_line_b[i] - park_line_b)/(double)(park_line_a - hori_line_a[i]) + (double)park_line_b;
		
		intersect_point.push_back(i_point);
		//cout << i_point << endl;
	}
	//cout << endl;
	line( color_dst, Point(1,242), Point(300,242), Scalar(255,255,0), 1, 8 );
	vector<Point> intersect_point_rlt;
	sort(intersect_point.begin(),intersect_point.end(),cmp);
	//int sumP=0;
	for(int i=0;i<intersect_point.size();++i)
	{
		//cout << intersect_point[i] << endl;
		if(i==intersect_point.size()-1)
		{
			intersect_point_rlt.push_back(intersect_point[i/*-sumP/3*2*/]);
		}
		else if(intersect_point[i+1].y - intersect_point[i].y > 10)
		{
			intersect_point_rlt.push_back(intersect_point[i/*-sumP/3*2*/]);
			//cout << intersect_point[i] << endl;
			//cout<<"#"<<intersect_point[i-sumP/3*2]<<endl;
			//sumP=0;
		}
		/*else
		{
			sumP++;
		}*/
	}
	if(intersect_point.size()==0)
	{
		cout<<"no intersect_point"<<endl;
		//waitKey(0);
		return 0;
	}
	else
	{
		intersect_point_rlt.push_back(intersect_point[intersect_point.size()-1]);

		//for(int i=0;i<intersect_point_rlt.size();++i)
		//{
		//	cout << intersect_point_rlt[i] << endl;
		//}
		//cout << endl;
	
		vector<double> intersect_point_distance;
		double temp_distance = 0;
		for(int i=0;i<intersect_point_rlt.size()-1;++i)
		{
			temp_distance = (double)(intersect_point_rlt[i+1].x - intersect_point_rlt[i].x)*(double)(intersect_point_rlt[i+1].x - intersect_point_rlt[i].x) + (double)(intersect_point_rlt[i+1].y - intersect_point_rlt[i].y)*(double)(intersect_point_rlt[i+1].y - intersect_point_rlt[i].y);
			//cout << intersect_point_rlt[i] << " " << intersect_point_rlt[i+1] << " " << sqrt(temp_distance) << endl;
			//cout << sqrt(temp_distance) << endl;
			//sqrt(temp_distance);
			intersect_point_distance.push_back(sqrt(temp_distance));
		
		}
		double big = 0;
		int b_num = 0;
		for(int i=0;i<intersect_point_distance.size();++i)
		{
			if(intersect_point_distance[i]>big)
			{
				big = intersect_point_distance[i];
				b_num=i;
			}
		}

		Point final_point1, final_point2;
		//double park_length = 0;
		final_point1 = intersect_point_rlt[b_num];
		final_point2 = intersect_point_rlt[b_num+1];
		//park_length = sqrt((double)(final_point1.x-final_point2.x)*(double)(final_point1.x-final_point2.x)+(double)(final_point1.y-final_point2.y)*(double)(final_point1.y-final_point2.y));

		//cout << final_point1 << " " << final_point2 << " " << big << endl;
		line( color_dst, final_point1, final_point2, Scalar(255,0,0), 3, 8 );//blue:park_line
		
		Point final_point3, final_point4;
		final_point3 = final_point1;
		final_point4 = final_point2;
		final_point3.x = final_point1.x + (double)(big*0.9);
		final_point4.x = final_point2.x + (double)(big*1.1);
		line( color_dst, final_point3, final_point4, Scalar(255,0,0), 3, 8 );//blue:park_line

		line( color_dst, final_point1, final_point3, Scalar(255,0,0), 3, 8 );//blue:park_line
		line( color_dst, final_point2, final_point4, Scalar(255,0,0), 3, 8 );//blue:park_line

		//Mat cut_space = src(Rect(colm/2, rows/2, colm/2, rows/2));//(Rect(final_point1.x, final_point1.y, final_point4.x - final_point1.x, final_point2.y - final_point1.y));
		//namedWindow( "cut_space", 1 );
		//imshow( "cut_space", cut);
		//namedWindow( "cut_space2", 1 );
		//imshow( "cut_space2", cut2);

		int minX,maxX,minY,maxY;
		minX=final_point1.x;
		minX=final_point2.x<minX?final_point2.x:minX;
		minX=final_point3.x<minX?final_point3.x:minX;
		minX=final_point4.x<minX?final_point4.x:minX;

		minY=final_point1.y;
		minY=final_point2.y<minY?final_point2.y:minY;
		minY=final_point3.y<minY?final_point3.y:minY;
		minY=final_point4.y<minY?final_point4.y:minY;

		maxX=final_point1.x;
		maxX=final_point2.x>maxX?final_point2.x:maxX;
		maxX=final_point3.x>maxX?final_point3.x:maxX;
		maxX=final_point4.x>maxX?final_point4.x:maxX;

		maxY=final_point1.y;
		maxY=final_point2.y>maxY?final_point2.y:maxY;
		maxY=final_point3.y>maxY?final_point3.y:maxY;
		maxY=final_point4.y>maxY?final_point4.y:maxY;

		if (maxX-minX==0 || maxY-minY==0)
		{
			cout<<"no parking spot"<<endl;
			waitKey(0);
			return 0;
		}

		else
		{
			cvRect(minX,minY,maxX-minX,maxY-minY);
			Mat cut_space;
			imshow( "cut3", cut3);
			cut_space=cut3(Rect(minX, minY, maxX-minX,maxY-minY));
			namedWindow( "cut_space", 1 );
			imshow( "cut_space", cut_space);

			blur(cut_space,cut_space,Size(3,3));
			imshow( "blur", cut_space );
			Canny(cut_space,cut_space,50,200,3);
			imshow( "edge", cut_space );

			vector<Mat> rgbChannels3(3);
			split(cut_space, rgbChannels3);

			int edgeNum=0;
			for (int i=0;i<cut_space.rows;++i)  
			{  
				uchar* data=cut_space.ptr<uchar>(i);
				for(int j=0;j<cut_space.cols;++j)
				{
					if(((int)data[j])==255)
						edgeNum++;
				}
			}
			cout<<edgeNum<<endl;
			if(edgeNum>4000)
			{
				cout<<"yes"<<endl;

				namedWindow( "Source", 1 );
				imshow( "Source", cut );

				namedWindow( "Detected Lines", 1 );
				imshow( "Detected Lines", color_dst );

				IplImage *color_dst2= new IplImage(color_dst);
			//	color_dst2 = &IplImage(color_dst);
				cvSaveImage("result.jpg",color_dst2);
				waitKey(0);
				return 1;
			}
			else
			{
				cout<<"no"<<endl;

				namedWindow( "Source", 1 );
				imshow( "Source", cut );

				namedWindow( "Detected Lines", 1 );
				imshow( "Detected Lines", color_dst );

				IplImage *color_dst2= new IplImage(color_dst);
			//	color_dst2 = &IplImage(color_dst);
				cvSaveImage("result.jpg",color_dst2);

				waitKey(0);
				return 0;
			}
		#else
			vector<Vec4i> lines;
			HoughLinesP( dst, lines, 1, CV_PI/180, 80, 30, 10 );
			for( size_t i = 0; i < lines.size(); i++ )
			{
				line( color_dst, Point(lines[i][0], lines[i][1]), Point(lines[i][2], lines[i][3]), Scalar(0,0,255), 3, 8 );
			}
		#endif
	
			/*namedWindow( "Source", 1 );
			imshow( "Source", cut );

			namedWindow( "Detected Lines", 1 );
			imshow( "Detected Lines", color_dst );
	
			//waitKey(0);
			return 0;*/
		}
	}
}

package com.mega.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created by Administrator on 2017/9/26.
 */
@Controller
public class TestController {
    @RequestMapping("/index")
    public  String index(){
        System.out.println(11111111);
        return  "index";
    }
    @RequestMapping("/test")
    public ModelAndView index(int s){
        System.out.println(2222222);
        return new ModelAndView("index");
    }
    class  Test{
        int age;
        String name;

        public int getAge() {
            return age;
        }

        public void setAge(int age) {
            this.age = age;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
    public static void main(String[] args) {
        String n=null;
        TestController controller=new TestController();
        TestController.Test test=controller.new Test();
        test.setName("sda");
        test.setAge(54);
		int kk=5;
        System.out.println(156651);

    }
}
